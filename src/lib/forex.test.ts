import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchForexData,
  getCurrencyIconName,
  clearForexCache,
  BASELINE_FOREX_RATES,
} from './forex';

describe('forex utility', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
    clearForexCache();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    clearForexCache();
  });

  it('returns currency icon names correctly', () => {
    expect(getCurrencyIconName('USD')).toBe('DollarSign');
    expect(getCurrencyIconName('EUR')).toBe('Euro');
    expect(getCurrencyIconName('JPY')).toBe('JapaneseYen');
    expect(getCurrencyIconName('GBP')).toBe('PoundSterling');
    expect(getCurrencyIconName('UNKNOWN')).toBe('');
  });

  it('uses primary BetterGov data when available', async () => {
    const mockBetterGovResponse = {
      rates: [
        {
          country: 'United States Dollar',
          symbol: 'USD',
          phpEquivalent: 58.75,
        },
        { country: 'Euro', symbol: 'EUR', phpEquivalent: 63.5 },
      ],
    };

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('bettergov.ph')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockBetterGovResponse),
        });
      }
      return Promise.reject(new Error('Should not call fallback'));
    });

    const rates = await fetchForexData(['USD']);
    expect(rates).toHaveLength(1);
    expect(rates[0]).toEqual({
      currency: 'United States Dollar',
      code: 'USD',
      rate: 58.75,
    });
  });

  it('falls back to open.er-api.com when BetterGov API returns 404', async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('bettergov.ph')) {
        return Promise.resolve({
          ok: false,
          status: 404,
          json: () =>
            Promise.resolve({ error: 'No forex data found in KV store' }),
        });
      }
      if (url.includes('open.er-api.com')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              result: 'success',
              rates: {
                USD: 0.016, // 1 / 0.016 = 62.5 PHP
                EUR: 0.015, // 1 / 0.015 = 66.6667 PHP
                PHP: 1,
              },
            }),
        });
      }
      return Promise.reject(new Error('Unknown url'));
    });

    const rates = await fetchForexData(['USD', 'EUR']);
    expect(rates).toHaveLength(2);
    expect(rates[0].code).toBe('USD');
    expect(rates[0].rate).toBe(62.5);
    expect(rates[1].code).toBe('EUR');
    expect(rates[1].rate).toBe(66.6667);
  });

  it('falls back to baseline reference rates when all network calls fail', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const rates = await fetchForexData(['USD', 'JPY']);
    expect(rates).toHaveLength(2);
    expect(rates[0].code).toBe('USD');
    expect(rates[0].rate).toBe(
      BASELINE_FOREX_RATES.find(r => r.code === 'USD')?.rate
    );
    expect(rates[1].code).toBe('JPY');
  });

  it('filters all rates when no symbol filter is specified', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Offline'));
    const rates = await fetchForexData();
    expect(rates.length).toBeGreaterThan(5);
  });
});
