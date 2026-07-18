import { z } from 'zod';

const schema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_ENV: z.enum(['development', 'staging', 'production']),
  VITE_ENABLE_MOCKS: z.enum(['true', 'false']).default('false').transform((v) => v === 'true'),
  VITE_GOOGLE_CLIENT_ID: z.string().min(1),
  VITE_OAUTH_REDIRECT_URI: z.string().url(),
});

const parsed = schema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
} 

export const env = parsed.data;

