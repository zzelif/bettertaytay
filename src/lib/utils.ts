import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Parses an array of strings (or a single string) containing multiple
 * phone numbers separated by slashes or commas into a flat, clean array.
 */
export function parsePhones(
  phones: (string | null)[] | string | null
): string[] {
  if (!phones) return [];

  // Ensure it is an array (handles both string and string[] inputs)
  const phoneArray = Array.isArray(phones) ? phones : [phones];

  return phoneArray
    .filter((p): p is string => Boolean(p))
    .flatMap(p => p.split(/(?:\/|,)\s*/))
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

/**
 * Convert phone number to tel: URI format (E.164)
 *  * Handles various formats:
 * - "530-2981 ext 3000" → "tel:+63495302981"
 * - "530-2981, 3000" → "tel:+63495302981"
 * - "049 536 7965" → "tel:+63495367965"
 * - "0927 509 1198" → "tel:+639275091198"
 */
export function toTelUri(phone: string | null): string | null {
  if (!phone) return null;

  // Remove extension keywords and everything after
  const mainNumber = phone
    .split(/(?:\/|,|ext|ex|x)\s*/i)[0]
    .replace(/[^\d+]/g, ''); // Keep only digits

  if (!mainNumber) return null;

  if (mainNumber.length === 10 && mainNumber.startsWith('02')) {
    // With area code: (02) 8284 4756 → 0282844756
    return `tel:+63${mainNumber.slice(1)}`;
  } else if (mainNumber.length === 8) {
    // Without area code: 8284 4756 → 82844756
    return `tel:+632${mainNumber}`;
  } else if (mainNumber.length === 11 && mainNumber.startsWith('09')) {
    // Mobile: 09275091198
    return `tel:+63${mainNumber.slice(1)}`;
  } else if (mainNumber.startsWith('63') || mainNumber.startsWith('+63')) {
    // Mobile: +639275091198
    return `tel:+${mainNumber.replace('+', '')}`;
  } else if (mainNumber.length === 9 && mainNumber.startsWith('8700')) {
    // 8 700 144 98 -> tel:+632870014498
    return `tel:+632${mainNumber}`;
  }

  return null;
}

/**
 * Parses a raw string containing multiple emails separated by slashes or commas
 * and returns a clean array of valid email addresses.
 * parseEmails("admin@taytay.gov.ph / tmg@taytay.gov.ph") → ["admin@taytay.gov.ph", "tmg@taytay.gov.ph"]
 */
export function parseEmails(emailStr: string | null): string[] {
  if (!emailStr) return [];

  return emailStr
    .split(/(?:\/|,)\s*/)
    .map(e => e.trim())
    .filter(e => e.length > 0 && e.includes('@'));
}
