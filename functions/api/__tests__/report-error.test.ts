/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest';
import { onRequest } from '../report-error';
import { createMockEnv, createMockRequest } from '../../test/test-utils';

describe('Report Error Endpoint (/api/report-error)', () => {
  let mockEnv: any;

  beforeEach(() => {
    mockEnv = createMockEnv();
    // Initialize the client_errors table as empty
    mockEnv.BETTERTAYTAY_DB.setTable('client_errors', []);
  });

  it('should accept valid error payloads and insert into database', async () => {
    const payload = {
      error_message: 'Test error message',
      error_stack: 'Error: Test error message\n  at Object.run (test.js:1:1)',
      component_stack: 'at TestComponent (test.tsx:1:1)',
      url: 'https://bettertaytay.gov.ph/discover/travel/visa',
      user_agent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    };

    const request = createMockRequest('https://example.com/api/report-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CF-Connecting-IP': '127.0.0.1',
      },
      body: payload,
    });

    const context = {
      request,
      env: mockEnv,
      next: () => Promise.resolve(new Response()),
      data: {},
      params: {},
      waitUntil: () => {},
    } as any;

    const response = await onRequest(context);
    const data = (await response.json()) as any;

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.id).toBeDefined();

    // Verify DB insertion
    const dbErrors = mockEnv.BETTERTAYTAY_DB.getTable('client_errors');
    expect(dbErrors.length).toBe(1);
    expect(dbErrors[0].error_message).toBe(payload.error_message);
    expect(dbErrors[0].error_stack).toBe(payload.error_stack);
    expect(dbErrors[0].component_stack).toBe(payload.component_stack);
    expect(dbErrors[0].url).toBe(payload.url);
    expect(dbErrors[0].user_agent).toBe(payload.user_agent);
    expect(dbErrors[0].id).toBe(data.id);
  });

  it('should return 400 Bad Request for invalid JSON payload', async () => {
    const payload = {
      url: 'not-a-valid-url',
    };

    const request = createMockRequest('https://example.com/api/report-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CF-Connecting-IP': '127.0.0.1',
      },
      body: payload,
    });

    const context = {
      request,
      env: mockEnv,
    } as any;

    const response = await onRequest(context);
    const data = (await response.json()) as any;

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid payload constraints');
    expect(data.details).toBeDefined();

    // Verify nothing was written to DB
    const dbErrors = mockEnv.BETTERTAYTAY_DB.getTable('client_errors');
    expect(dbErrors.length).toBe(0);
  });

  it('should return 400 Bad Request for oversized error_message (payload constraints)', async () => {
    const oversizedMessage = 'a'.repeat(1001);
    const payload = {
      error_message: oversizedMessage,
      url: 'https://bettertaytay.gov.ph/',
    };

    const request = createMockRequest('https://example.com/api/report-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CF-Connecting-IP': '127.0.0.1',
      },
      body: payload,
    });

    const context = {
      request,
      env: mockEnv,
    } as any;

    const response = await onRequest(context);
    const data = (await response.json()) as any;

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid payload constraints');

    const dbErrors = mockEnv.BETTERTAYTAY_DB.getTable('client_errors');
    expect(dbErrors.length).toBe(0);
  });

  it('should return 405 Method Not Allowed for GET request', async () => {
    const request = createMockRequest('https://example.com/api/report-error', {
      method: 'GET',
    });

    const context = {
      request,
      env: mockEnv,
    } as any;

    const response = await onRequest(context);
    const data = (await response.json()) as any;

    expect(response.status).toBe(405);
    expect(data.error).toContain('Method Not Allowed');
    expect(response.headers.get('Allow')).toBe('POST');
  });

  it('should rate limit client error reporting when requests exceed limits', async () => {
    // Config limit is 20 errors per minute
    for (let i = 0; i < 20; i++) {
      const request = createMockRequest(
        'https://example.com/api/report-error',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CF-Connecting-IP': '127.0.0.1',
          },
          body: {
            error_message: `Test error ${i}`,
            url: 'https://bettertaytay.gov.ph/',
          },
        }
      );

      const context = { request, env: mockEnv } as any;
      const res = await onRequest(context);
      expect(res.status).toBe(201);
    }

    const request21 = createMockRequest(
      'https://example.com/api/report-error',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CF-Connecting-IP': '127.0.0.1',
        },
        body: {
          error_message: 'Too many errors',
          url: 'https://bettertaytay.gov.ph/',
        },
      }
    );

    const context21 = { request: request21, env: mockEnv } as any;
    const response21 = await onRequest(context21);
    const data21 = (await response21.json()) as any;

    expect(response21.status).toBe(429);
    expect(data21.error).toBe('Too many requests');
  });
});
