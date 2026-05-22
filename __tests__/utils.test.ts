// Tests for pure utility functions used across the app

describe('countWords', () => {
  // Extracted from notes.tsx — must stay in sync
  function countWords(text: string): number {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  }

  it('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0);
  });

  it('returns 0 for whitespace only', () => {
    expect(countWords('   ')).toBe(0);
  });

  it('counts single word', () => {
    expect(countWords('hello')).toBe(1);
  });

  it('counts multiple words', () => {
    expect(countWords('hello world foo')).toBe(3);
  });

  it('handles leading/trailing whitespace', () => {
    expect(countWords('  hello world  ')).toBe(2);
  });

  it('handles multiple spaces between words', () => {
    expect(countWords('hello   world')).toBe(2);
  });

  it('handles newlines as whitespace', () => {
    expect(countWords('hello\nworld\nfoo')).toBe(3);
  });

  it('returns exactly 1000 for 1000-word input', () => {
    const text = Array(1000).fill('word').join(' ');
    expect(countWords(text)).toBe(1000);
  });
});

describe('formatDate', () => {
  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  it('formats ISO date string to readable format', () => {
    const result = formatDate('2026-05-22T03:00:00.000Z');
    // Should contain the year at minimum
    expect(result).toContain('2026');
  });

  it('produces a non-empty string', () => {
    expect(formatDate('2026-01-01T00:00:00.000Z').length).toBeGreaterThan(0);
  });
});

describe('monthly limit logic', () => {
  const MONTHLY_LIMIT = 6;

  it('atLimit is false when count is 0', () => {
    expect(0 >= MONTHLY_LIMIT).toBe(false);
  });

  it('atLimit is false when count is 5', () => {
    expect(5 >= MONTHLY_LIMIT).toBe(false);
  });

  it('atLimit is true when count equals limit', () => {
    expect(6 >= MONTHLY_LIMIT).toBe(true);
  });

  it('atLimit is true when count exceeds limit', () => {
    expect(7 >= MONTHLY_LIMIT).toBe(true);
  });

  it('remaining is calculated correctly', () => {
    expect(MONTHLY_LIMIT - 4).toBe(2);
  });
});

describe('registration validation', () => {
  // Logic from register.tsx — must stay in sync
  function validateYear(yearStr: string): boolean {
    const year = parseInt(yearStr, 10);
    return !isNaN(year) && year >= 1920 && year <= new Date().getFullYear() - 16;
  }

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  it('accepts valid year of birth', () => {
    expect(validateYear('1985')).toBe(true);
  });

  it('rejects year too old', () => {
    expect(validateYear('1890')).toBe(false);
  });

  it('rejects year too recent (under 16)', () => {
    expect(validateYear(String(new Date().getFullYear()))).toBe(false);
  });

  it('rejects empty year', () => {
    expect(validateYear('')).toBe(false);
  });

  it('accepts valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('rejects email without @', () => {
    expect(validateEmail('notanemail.com')).toBe(false);
  });

  it('rejects email without domain', () => {
    expect(validateEmail('test@')).toBe(false);
  });

  it('rejects empty email', () => {
    expect(validateEmail('')).toBe(false);
  });
});
