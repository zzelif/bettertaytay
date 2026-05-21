import { describe, it, expect } from 'vitest';
import {
  cn,
  formatDate,
  truncateText,
  getRandomNumber,
  toTelUri,
} from './utils';

describe('cn() - className merge utility', () => {
  it('merges class names correctly', () => {
    const result = cn('px-4', 'py-2');
    expect(result).toBe('px-4 py-2');
  });

  it('handles Tailwind conflicts by using later classes', () => {
    const result = cn('px-4', 'px-2');
    expect(result).toBe('px-2');
  });

  it('handles conditional classes', () => {
    const showConditional = false;
    const result = cn('base-class', showConditional && 'conditional-class');
    expect(result).toBe('base-class');
  });

  it('handles empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('handles arrays of classes', () => {
    const result = cn(['px-4', 'py-2'], 'bg-white');
    expect(result).toBe('px-4 py-2 bg-white');
  });

  it('merges conflicting Tailwind classes correctly', () => {
    const result = cn('p-4', 'p-2');
    expect(result).toBe('p-2');
  });
});

describe('formatDate() - date formatting', () => {
  it('formats date in Philippine locale format', () => {
    const date = new Date('2024-02-26');
    const result = formatDate(date);
    expect(result).toMatch(/February 26, 2024/);
  });

  it('handles different date correctly', () => {
    const date = new Date('2023-12-25');
    const result = formatDate(date);
    expect(result).toMatch(/December 25, 2023/);
  });

  it('handles leap year dates', () => {
    const date = new Date('2024-02-29');
    const result = formatDate(date);
    expect(result).toMatch(/February 29, 2024/);
  });
});

describe('truncateText() - text truncation', () => {
  it('returns text unchanged when shorter than max length', () => {
    const result = truncateText('Hello', 10);
    expect(result).toBe('Hello');
  });

  it('returns text unchanged when equal to max length', () => {
    const result = truncateText('Hello', 5);
    expect(result).toBe('Hello');
  });

  it('truncates text longer than max length and adds ellipsis', () => {
    const result = truncateText('Hello World', 8);
    expect(result).toBe('Hello Wo...');
  });

  it('handles empty string', () => {
    const result = truncateText('', 10);
    expect(result).toBe('');
  });

  it('handles single character', () => {
    const result = truncateText('A', 1);
    expect(result).toBe('A');
  });

  it('truncates to zero characters with ellipsis only', () => {
    const result = truncateText('Hello', 0);
    expect(result).toBe('...');
  });
});

describe('getRandomNumber() - random number generation', () => {
  it('returns number within specified range inclusive', () => {
    const result = getRandomNumber(1, 10);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
  });

  it('returns same min and max value', () => {
    const result = getRandomNumber(5, 5);
    expect(result).toBe(5);
  });

  it('handles negative numbers', () => {
    const result = getRandomNumber(-10, -5);
    expect(result).toBeGreaterThanOrEqual(-10);
    expect(result).toBeLessThanOrEqual(-5);
  });

  it('handles zero range', () => {
    const result = getRandomNumber(0, 0);
    expect(result).toBe(0);
  });
});

describe('toTelUri() - phone number to tel: URI conversion', () => {
  it('converts local 8-digit number with no area code', () => {
    const result = toTelUri('8284-4756');
    expect(result).toBe('tel:+63282844756');
  });

  it('converts 9-digit number starting with 8700', () => {
    const result = toTelUri('8 700 144 98');
    expect(result).toBe('tel:+632870014498');
  });

  it('converts 10-digit number with area code 02', () => {
    const result = toTelUri('02 8284 4756');
    expect(result).toBe('tel:+63282844756');
  });

  it('converts 11-digit mobile number starting with 09', () => {
    const result = toTelUri('0927 509 1198');
    expect(result).toBe('tel:+639275091198');
  });

  it('converts 12-digit mobile number starting with 63 or +63', () => {
    const result = toTelUri('+63 927 509 1198');
    expect(result).toBe('tel:+639275091198');
  });

  it('returns null for null input', () => {
    const result = toTelUri(null);
    expect(result).toBeNull();
  });

  it('returns null for empty string', () => {
    const result = toTelUri('');
    expect(result).toBeNull();
  });

  it('returns null for unrecognizable format', () => {
    const result = toTelUri('invalid');
    expect(result).toBeNull();
  });

  it('handles 8-digit number with spaces', () => {
    const result = toTelUri('8284 4756');
    expect(result).toBe('tel:+63282844756');
  });

  it('handles 9-digit number with hypens', () => {
    const result = toTelUri('8700-144-98');
    expect(result).toBe('tel:+632870014498');
  });

  it('handles 10-digit number with hyphens', () => {
    const result = toTelUri('02-8284-4756');
    expect(result).toBe('tel:+63282844756');
  });

  it('handles 11-digit mobile number with hyphens', () => {
    const result = toTelUri('0927-509-1198');
    expect(result).toBe('tel:+639275091198');
  });

  it('handles 12-digit mobile number with hyphens', () => {
    const result = toTelUri('+63-927-509-1198');
    expect(result).toBe('tel:+639275091198');
  });
});
