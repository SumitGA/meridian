import { z } from 'zod';

const schema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_OAUTH_CLIENT_ID: z.string().min(1),
  VITE_ENV: z.enum(['development', 'staging', 'production']),
});

export const env = schema.parse(import.meta.env);