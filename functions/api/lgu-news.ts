/**
 * LGU News API
 * GET /api/lgu-news - Scrapes taytayrizal.gov.ph RSS feed for recent news posts
 *
 * Extracts the 3 most recent posts from the Taytay LGU website.
 * Uses KV caching with 15-minute TTL and rate limiting (30 requests/minute).
 */
import { createKVCache, CACHE_TTL } from '../utils/kv-cache';
import { cachedJson } from '../utils/cache';
import {
  checkRateLimit,
  getClientIdentifier,
  addRateLimitHeaders,
  createRateLimitResponse,
} from '../utils/rate-limit';
import type { Env } from '../types';

/**
 * LGU News Post structure
 */
interface LGUNewsPost {
  title: string;
  url: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  categories: string[];
}

/**
 * API Response shape
 */
interface LGUNewsResponse {
  posts: LGUNewsPost[];
  source: string;
  cached: boolean;
}

/**
 * Fetch and parse LGU RSS Feed to extract recent news posts
 */
async function fetchAndParse(): Promise<LGUNewsResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    // Target the Wix Blog RSS Feed
    const response = await fetch(
      'https://www.taytayrizal.gov.ph/blog-feed.xml',
      {
        signal: controller.signal,
        headers: {
          'User-Agent': 'LGU-Dashboard-Bot/1.0',
          Accept: 'application/rss+xml, application/xml, text/xml',
        },
      }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const posts: LGUNewsPost[] = [];

    // Match individual <item> tags
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null && posts.length < 3) {
      const itemContent = match[1];

      // 1. Extract Title
      const titleMatch =
        itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
        itemContent.match(/<title>(.*?)<\/title>/);
      const title = titleMatch ? titleMatch[1].trim() : 'No Title';

      // 2. Extract URL from link
      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
      const url = linkMatch ? linkMatch[1].trim() : '';

      // 3. Extract Date from pubDate
      const dateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);
      let date = '';
      if (dateMatch) {
        const d = new Date(dateMatch[1]);
        date = !isNaN(d.getTime())
          ? d.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : dateMatch[1];
      }

      // 4. Extract Image URL
      const imageMatch = itemContent.match(/<enclosure[^>]+url="([^"]+)"/i);
      const imageUrl = imageMatch ? imageMatch[1].trim() : '';

      // 5. Extract Excerpt from description
      const descMatch =
        itemContent.match(
          /<description><!\[CDATA\[(.*?)\]\]><\/description>/
        ) || itemContent.match(/<description>(.*?)<\/description>/);

      let excerpt = '';
      if (descMatch) {
        // Strip HTML tags from description if present
        excerpt = descMatch[1]
          .replace(/<[^>]+>/g, '') // remove HTML tags
          .replace(/&nbsp;/g, ' ') // remove non-breaking spaces
          .replace(/\s+/g, ' ') // normalize whitespace
          .trim();

        // Limit excerpt length
        if (excerpt.length > 150) {
          excerpt = excerpt.substring(0, 147) + '...';
        }
      }

      // 6. Extract Category from category (max of 3)
      const categoryMatches =
        itemContent.match(/<category>[\s\S]*?<\/category>/gi) || [];
      const categories = categoryMatches
        .map(cat =>
          cat
            .replace(/<\/?category>/gi, '')
            .replace(/<!\[CDATA\[/gi, '')
            .replace(/\]\]>/g, '')
            .trim()
        )
        .filter(cat => cat !== '')
        .slice(0, 3);

      posts.push({
        title,
        url,
        date,
        excerpt,
        imageUrl,
        categories,
      });
    }

    return {
      posts,
      source: 'taytayrizal.gov.ph',
      cached: false,
    };
  } catch (error) {
    console.error('Error fetching LGU news:', error);
    throw error;
  }
}

/**
 * GET /api/lgu-news
 * Returns the 3 most recent news posts from taytayrizal.gov.ph
 */
export async function onRequestGet(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;

  try {
    // Rate limit check: 30 reqs per minute
    const rateLimitResult = await checkRateLimit(
      env.WEATHER_KV,
      'lgu-news:' + getClientIdentifier(request),
      { limit: 30, window: 60 }
    );

    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult, 30);
    }

    // Use KV cache with 15-minute TTL
    const kvCache = createKVCache(env);
    const result = await kvCache.get<LGUNewsResponse>(
      'lgu-news:homepage',
      async () => {
        return await fetchAndParse();
      },
      CACHE_TTL.list
    );

    // Marked as cached when coming from KV
    const response = cachedJson(
      {
        ...result,
        cached: true,
      },
      'list'
    );

    // Add rate limit helpers
    return addRateLimitHeaders(response, rateLimitResult, 30);
  } catch (error) {
    console.error('LGU news API error:', error);
    return cachedJson(
      { error: 'Failed to fetch news', posts: [] },
      'none',
      502
    );
  }
}
