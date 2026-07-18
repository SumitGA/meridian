// src/features/auth/api/oauthApi.ts
import axios from 'axios';
import { env } from '@/shared/config/env';
import { authResponseSchema } from '../model/schemas';
import type { AuthResponse } from '../model/types';

export interface ExchangeInput {
  code: string;
  codeVerifier: string;
}

/**
 * Bare axios, not `http` — same reason as refresh().
 * There is no session yet, so the auth interceptor has nothing to add
 * and a 401 here must NOT trigger a refresh attempt.
 */
export async function exchangeGoogleCode(input: ExchangeInput): Promise<AuthResponse> {
  const res = await axios.post(
    `${env.VITE_API_URL}/auth/oauth/google`,
    {
      code: input.code,
      codeVerifier: input.codeVerifier,
      redirectUri: env.VITE_OAUTH_REDIRECT_URI,
    },
    { withCredentials: true },
  );
  return authResponseSchema.parse(res.data);
}