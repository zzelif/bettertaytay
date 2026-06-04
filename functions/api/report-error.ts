/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import { Env } from '../types';
import {
  checkRateLimit,
  getClientIdentifier,
  createRateLimitResponse,
  addRateLimitHeaders,
} from '../utils/rate-limit';

// Strict validation schema for client exceptions to prevent arbitrary database insertion
const clientErrorSchema = z.object({
  error_message: z.string().min(1).max(1000),
  error_stack: z.string().max(10000).optional(),
  component_stack: z.string().max(10000).optional(),
  url: z.string().url().max(2000),
  user_agent: z.string().max(500).optional(),
});

type ClientErrorPayload = z.infer<typeof clientErrorSchema>;

async function handlePost(context: EventContext<Env, any, any>) {
  const { env, request } = context;

  // 1. Rate Limiting Check (anonymous IP based bucket, limit to 20 errors per minute)
  const clientIp = getClientIdentifier(request);
  const rateLimitKey = `rate_limit:client_error:${clientIp}`;
  const rateLimitConfig = { limit: 20, window: 60 };

  const rateLimitResult = await checkRateLimit(
    env.BROWSER_KV,
    rateLimitKey,
    rateLimitConfig
  );

  if (!rateLimitResult.allowed) {
    return createRateLimitResponse(rateLimitResult, rateLimitConfig.limit);
  }

  // 2. Parse and Validate Payload
  try {
    const rawBody = await request.json();
    const parseResult = clientErrorSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const response = new Response(
        JSON.stringify({
          error: 'Invalid payload constraints',
          details: parseResult.error.format(),
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
      return addRateLimitHeaders(
        response,
        rateLimitResult,
        rateLimitConfig.limit
      );
    }

    const payload: ClientErrorPayload = parseResult.data;
    const errorId = crypto.randomUUID();

    // 3. Database Insertion (D1 Database)
    const db = env.BETTERTAYTAY_DB || env.DB;
    if (!db) {
      const response = new Response(
        JSON.stringify({ error: 'Database binding unavailable' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
      return addRateLimitHeaders(
        response,
        rateLimitResult,
        rateLimitConfig.limit
      );
    }

    await db
      .prepare(
        `INSERT INTO client_errors (id, error_message, error_stack, component_stack, url, user_agent, timestamp)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, datetime('now'))`
      )
      .bind(
        errorId,
        payload.error_message,
        payload.error_stack || null,
        payload.component_stack || null,
        payload.url,
        payload.user_agent || null
      )
      .run();

    const response = new Response(
      JSON.stringify({ success: true, id: errorId }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
    return addRateLimitHeaders(
      response,
      rateLimitResult,
      rateLimitConfig.limit
    );
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error ? error.message : 'Internal Server Error';
    const response = new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
    return addRateLimitHeaders(
      response,
      rateLimitResult,
      rateLimitConfig.limit
    );
  }
}

export const onRequest: PagesFunction<Env> = async context => {
  if (context.request.method === 'POST') {
    return handlePost(context);
  }
  return new Response(
    JSON.stringify({ error: 'Method Not Allowed. Use POST to report errors.' }),
    {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    }
  );
};
