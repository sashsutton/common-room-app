// Tests for API helper functions — Supabase client is mocked

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getSession: jest.fn(),
    },
    functions: {
      invoke: jest.fn(),
    },
  },
}));

import { supabase } from '@/lib/supabase';
import {
  fetchMonthlyReflectionCount,
  generateReflections,
} from '@/lib/api';

const mockFrom = supabase.from as jest.Mock;
const mockInvoke = supabase.functions.invoke as jest.Mock;
const mockGetSession = supabase.auth.getSession as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fetchMonthlyReflectionCount', () => {
  it('returns 0 when no reflections this month', async () => {
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          gte: jest.fn().mockResolvedValue({ count: 0, error: null }),
        }),
      }),
    });
    const count = await fetchMonthlyReflectionCount('user-123');
    expect(count).toBe(0);
  });

  it('returns correct count when reflections exist', async () => {
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          gte: jest.fn().mockResolvedValue({ count: 4, error: null }),
        }),
      }),
    });
    const count = await fetchMonthlyReflectionCount('user-123');
    expect(count).toBe(4);
  });

  it('throws on database error', async () => {
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          gte: jest.fn().mockResolvedValue({ count: null, error: { message: 'DB error' } }),
        }),
      }),
    });
    await expect(fetchMonthlyReflectionCount('user-123')).rejects.toEqual({ message: 'DB error' });
  });

  it('returns 0 when count is null (no rows)', async () => {
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          gte: jest.fn().mockResolvedValue({ count: null, error: null }),
        }),
      }),
    });
    const count = await fetchMonthlyReflectionCount('user-123');
    expect(count).toBe(0);
  });
});

describe('generateReflections', () => {
  it('returns 3 reflections on success', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { access_token: 'test-token' } },
    });
    mockInvoke.mockResolvedValue({
      data: { reflections: ['r1', 'r2', 'r3'] },
      error: null,
    });
    const result = await generateReflections('user-123');
    expect(result).toEqual(['r1', 'r2', 'r3']);
    expect(result).toHaveLength(3);
  });

  it('invokes the correct function name', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockInvoke.mockResolvedValue({
      data: { reflections: ['r1', 'r2', 'r3'] },
      error: null,
    });
    await generateReflections('user-123');
    expect(mockInvoke).toHaveBeenCalledWith(
      'generate-reflections',
      expect.any(Object)
    );
  });

  it('throws when edge function returns an error', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockInvoke.mockResolvedValue({
      data: null,
      error: { message: 'Monthly limit reached', context: null },
    });
    await expect(generateReflections('user-123')).rejects.toThrow();
  });
});
