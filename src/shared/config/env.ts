import { z } from 'zod';

const schema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_OAUTH_CLIENT_ID: z.string().min(1),
  VITE_ENV: z.enum(['development', 'staging', 'production']),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  throw new Error('Invalid environment variables');
} 

export const env = parsed.data;

