/**
 * Environment variable validation
 * Ensures all required environment variables are present at build time
 */

interface EnvVars {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
}

function validateEnv(): EnvVars {
  const requiredVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };

  const missingVars: string[] = [];

  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value || value === '') {
      missingVars.push(key);
    }
  }

  if (missingVars.length > 0) {
    const errorMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Missing Required Environment Variables
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The following environment variables are required but not set:

${missingVars.map(v => `  • ${v}`).join('\n')}

To fix this:
1. Copy .env.example to .env
2. Fill in your Supabase credentials
3. Restart the dev server

Need help? Check the README for setup instructions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    throw new Error(errorMessage);
  }

  return requiredVars as EnvVars;
}

// Validate immediately when module is imported
export const env = validateEnv();

// Type-safe access to environment variables
export const config = {
  supabase: {
    url: env.VITE_SUPABASE_URL,
    anonKey: env.VITE_SUPABASE_ANON_KEY,
  },
} as const;
