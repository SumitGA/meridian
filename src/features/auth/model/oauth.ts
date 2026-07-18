// src/features/auth/model/oauth.ts
import { z } from 'zod';
import { env } from '@/shared/config/env';

export function getAuthorizeUrl(): string {
  return env.VITE_ENABLE_MOCKS
    ? `${window.location.origin}/mock-consent`
    : 'https://accounts.google.com/o/oauth2/v2/auth';
}

export const oauthCallbackParamsSchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1),
});

/** Google returns errors as query params, not HTTP status codes. */
export const oauthErrorParamsSchema = z.object({
  error: z.string(),
  error_description: z.string().optional(),
});

export type OAuthCallbackParams = z.infer<typeof oauthCallbackParamsSchema>;