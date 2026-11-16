import { ForexRate } from '../types';

const CACHE_KEY = 'bettertaytay_forex_cache';
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

interface ForexCacheEntry {
  timestamp: number;
  rates: ForexRate[];
}

let memoryCache: ForexCacheEntry | null = null;

const CURRENCY_NAMES: Record<string, string> = {
  USD: 'United States Dollar',
  EUR: 'Euro',
  GBP: 'British Pound Sterling',
  JPY: 'Japanese Yen',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  SEK: 'Swedish Krona',
  NZD: 'New Zealand Dollar',
  MXN: 'Mexican Peso',
  SGD: 'Singapore Dollar',
  HKD: 'Hong Kong Dollar',
  NOK: 'Norwegian Krone',
  KRW: 'South Korean Won',
  TRY: 'Turkish Lira',
  RUB: 'Russian Ruble',
  INR: 'Indian Rupee',
  BRL: 'Brazilian Real',
  ZAR: 'South African Rand',
  DKK: 'Danish Krone',
  PLN: 'Polish Zloty',
  TWD: 'Taiwan Dollar',
  THB: 'Thai Baht',
  MYR: 'Malaysian Ringgit',
  IDR: 'Indonesian Rupiah',
  VND: 'Vietnamese Dong',
  CZK: 'Czech Koruna',
  HUF: 'Hungarian Forint',
  ILS: 'Israeli Shekel',
  CLP: 'Chilean Peso',
  PEN: 'Peruvian Sol',
  COP: 'Colombian Peso',
  BHD: 'Bahraini Dinar',
  KWD: 'Kuwaiti Dinar',
  SAR: 'Saudi Riyal',
  AED: 'UAE Dirham',
  BND: 'Brunei Dollar',
};

// Baseline reference rates if offline and no cache exists
export const BASELINE_FOREX_RATES: ForexRate[] = [
  { currency: 'United States Dollar', code: 'USD', rate: 58.5 },
  { currency: 'Euro', code: 'EUR', rate: 63.2 },
  { currency: 'British Pound Sterling', code: 'GBP', rate: 74.8 },
  { currency: 'Japanese Yen', code: 'JPY', rate: 0.38 },
  { currency: 'Australian Dollar', code: 'AUD', rate: 38.6 },
  { currency: 'Singapore Dollar', code: 'SGD', rate: 44.5 },
  { currency: 'Canadian Dollar', code: 'CAD', rate: 42.1 },
  { currency: 'Swiss Franc', code: 'CHF', rate: 66.4 },
  { currency: 'Chinese Yuan', code: 'CNY', rate: 8.1 },
  { currency: 'Hong Kong Dollar', code: 'HKD', rate: 7.5 },
  { currency: 'South Korean Won', code: 'KRW', rate: 0.043 },
  { currency: 'Saudi Riyal', code: 'SAR', rate: 15.6 },
  { currency: 'UAE Dirham', code: 'AED', rate: 15.9 },
  { currency: 'New Zealand Dollar', code: 'NZD', rate: 35.2 },
  { currency: 'Taiwan Dollar', code: 'TWD', rate: 1.8 },
  { currency: 'Thai Baht', code: 'THB', rate: 1.6 },
  { currency: 'Malaysian Ringgit', code: 'MYR', rate: 12.8 },
  { currency: 'Indonesian Rupiah', code: 'IDR', rate: 0.0037 },
  { currency: 'Vietnamese Dong', code: 'VND', rate: 0.0023 },
];

export function clearForexCache(): void {
  memoryCache = null;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(CACHE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

function readCache(): ForexRate[] | null {
  const now = Date.now();
  if (memoryCache && now - memoryCache.timestamp < CACHE_DURATION_MS) {
    return memoryCache.rates;
  }
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ForexCacheEntry;
        if (
          parsed.rates &&
          Array.isArray(parsed.rates) &&
          now - parsed.timestamp < CACHE_DURATION_MS
        ) {
          memoryCache = parsed;
          return parsed.rates;
        }
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return null;
}

function writeCache(rates: ForexRate[]): void {
  const entry: ForexCacheEntry = {
    timestamp: Date.now(),
    rates,
  };
  memoryCache = entry;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    }
  } catch {
    // Ignore storage quota errors
  }
}

function filterRates(
  rates: ForexRate[],
  filterSymbols?: string[]
): ForexRate[] {
  if (!filterSymbols || filterSymbols.length === 0) {
    return rates;
  }
  return rates.filter(rate => filterSymbols.includes(rate.code));
}

/**
 * Fetch forex data with fallback and client-side caching.
 * Tries BetterGov API first; if unavailable, falls back to open.er-api.com,
 * then to localStorage cache, and finally to baseline reference rates.
 */
export const fetchForexData = async (
  filterSymbols?: string[]
): Promise<ForexRate[]> => {
  // 1. Check valid cache first
  const cachedRates = readCache();
  if (cachedRates && cachedRates.length > 0) {
    return filterRates(cachedRates, filterSymbols);
  }

  let freshRates: ForexRate[] | null = null;

  // 2. Try external BetterGov API (primary source)
  try {
    const res = await fetch('https://api.bettergov.ph/forex', {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.rates) && data.rates.length > 0) {
        freshRates = data.rates.map(
          (rate: {
            country: string;
            symbol: string;
            phpEquivalent: number;
          }) => ({
            currency:
              rate.country || CURRENCY_NAMES[rate.symbol] || rate.symbol,
            code: rate.symbol,
            rate: rate.phpEquivalent,
          })
        );
      }
    }
  } catch (err) {
    console.warn(
      'Primary BetterGov forex fetch failed, falling back to open exchange rates:',
      err
    );
  }

  // 3. Fallback to reliable free open exchange rate API if primary is unavailable
  if (!freshRates || freshRates.length === 0) {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/PHP', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates && typeof data.rates === 'object') {
          const list: ForexRate[] = [];
          for (const [symbol, rateAgainstPhp] of Object.entries(data.rates)) {
            if (symbol === 'PHP') continue;
            const rateNum = Number(rateAgainstPhp);
            if (rateNum > 0) {
              const phpEquiv = Math.round((1.0 / rateNum) * 10000) / 10000;
              list.push({
                currency: CURRENCY_NAMES[symbol] || symbol,
                code: symbol,
                rate: phpEquiv,
              });
            }
          }
          if (list.length > 0) {
            freshRates = list;
          }
        }
      }
    } catch (err) {
      console.warn('Fallback open exchange rate fetch failed:', err);
    }
  }

  // 4. Save to cache if fresh rates obtained
  if (freshRates && freshRates.length > 0) {
    writeCache(freshRates);
    return filterRates(freshRates, filterSymbols);
  }

  // 5. Ultimate fallback: expired localStorage cache or baseline reference rates
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ForexCacheEntry;
        if (
          parsed.rates &&
          Array.isArray(parsed.rates) &&
          parsed.rates.length > 0
        ) {
          return filterRates(parsed.rates, filterSymbols);
        }
      }
    }
  } catch {
    // Ignore localStorage errors
  }

  return filterRates(BASELINE_FOREX_RATES, filterSymbols);
};

/**
 * Get currency icon component name based on currency code
 * @param code Currency code
 * @returns Icon component name
 */
export const getCurrencyIconName = (code: string): string => {
  switch (code) {
    case 'USD':
      return 'DollarSign';
    case 'JPY':
      return 'JapaneseYen';
    case 'EUR':
      return 'Euro';
    case 'GBP':
      return 'PoundSterling';
    default:
      return '';
  }
};
