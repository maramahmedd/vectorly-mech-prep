import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Environment Variable Validation', () => {
  const originalEnv = import.meta.env;

  beforeEach(() => {
    // Reset modules between tests
    vi.resetModules();
  });

  it('should validate and return env vars when all are present', () => {
    // Mock valid environment variables
    vi.stubGlobal('import.meta', {
      env: {
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'test-anon-key',
      },
    });

    // Dynamically import to get fresh module
    return import('./env').then(({ env, config }) => {
      expect(env.VITE_SUPABASE_URL).toBe('https://test.supabase.co');
      expect(env.VITE_SUPABASE_ANON_KEY).toBe('test-anon-key');
      expect(config.supabase.url).toBe('https://test.supabase.co');
      expect(config.supabase.anonKey).toBe('test-anon-key');
    });
  });

  it('should throw error when VITE_SUPABASE_URL is missing', async () => {
    vi.stubGlobal('import.meta', {
      env: {
        VITE_SUPABASE_URL: '',
        VITE_SUPABASE_ANON_KEY: 'test-anon-key',
      },
    });

    await expect(async () => {
      await import('./env?t=' + Date.now()); // Cache busting
    }).rejects.toThrow(/VITE_SUPABASE_URL/);
  });

  it('should throw error when VITE_SUPABASE_ANON_KEY is missing', async () => {
    vi.stubGlobal('import.meta', {
      env: {
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: '',
      },
    });

    await expect(async () => {
      await import('./env?t=' + Date.now());
    }).rejects.toThrow(/VITE_SUPABASE_ANON_KEY/);
  });

  it('should throw error when all env vars are missing', async () => {
    vi.stubGlobal('import.meta', {
      env: {
        VITE_SUPABASE_URL: '',
        VITE_SUPABASE_ANON_KEY: '',
      },
    });

    await expect(async () => {
      await import('./env?t=' + Date.now());
    }).rejects.toThrow(/Missing Required Environment Variables/);
  });

  it('should provide helpful error message with setup instructions', async () => {
    vi.stubGlobal('import.meta', {
      env: {
        VITE_SUPABASE_URL: '',
        VITE_SUPABASE_ANON_KEY: '',
      },
    });

    await expect(async () => {
      await import('./env?t=' + Date.now());
    }).rejects.toThrow(/Copy \.env\.example to \.env/);
  });
});
