import axios from 'axios';
import { http } from '@/shared/lib/http';
import { env } from '@/shared/config/env';
import { authResponseSchema } from '../model/schemas';
import type { AuthResponse, LoginRequest } from '../model/types';

export async function login(body: LoginRequest): Promise<AuthResponse> {
  const res = await http.post('/auth/login', body);
  return authResponseSchema.parse(res.data);
}

/**
 * Uses a BARE axios call, not `http`.
 * `http` carries the auth interceptor — refreshing through it would
 * recurse on 401. The refresh endpoint authenticates via HttpOnly cookie only.
 */
export async function refresh(): Promise<AuthResponse> {
  const res = await axios.post(
    `${env.VITE_API_URL}/auth/refresh`,
    {},
    { withCredentials: true },
  );
  return authResponseSchema.parse(res.data);
}

export async function logout(): Promise<void> {
  await http.post('/auth/logout');
}