// src/test/mocks/handlers/auth.ts
import { http, HttpResponse } from 'msw';
import { env } from '@/shared/config/env';
import { users, refreshTokens, revokedFamilies } from '../db';
import { simulate, NETWORK } from '../latency';

const api = (path: string) => `${env.VITE_API_URL}${path}`;

const ACCESS_TTL_MS = 100_000; // absurdly short on purpose — see below

function issueAccessToken(userId: string): string {
  // NOT a real JWT. Opaque token; the server decides what it means.
  return `at.${userId}.${Date.now() + ACCESS_TTL_MS}`;
}

function readAccessToken(req: Request): { userId: string } | null {
  const header = req.headers.get('Authorization');
  if (!header?.startsWith('Bearer ')) return null;

  const [, userId, expiresAt] = header.slice(7).split('.');
  if (!userId || !expiresAt) return null;
  if (Date.now() > Number(expiresAt)) return null;

  return { userId };
}

function issueRefreshToken(userId: string, family = crypto.randomUUID()): string {
  const token = crypto.randomUUID();
  refreshTokens.set(token, { userId, family });
  return token;
}

/** Exported for use by other handler files. */
export function requireAuth(req: Request) {
  const session = readAccessToken(req);
  if (!session) {
    return { error: HttpResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }
  const user = users.find((u) => u.id === session.userId);
  if (!user) {
    return { error: HttpResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }
  return { user };
}

const toDto = (u: (typeof users)[number]) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  role: u.role,
});

export const authHandlers = [
  http.post(api('/auth/login'), async ({ request }) => {
    await simulate(NETWORK.slow);
    const body = (await request.json()) as {
      email: string;
      password: string;
      rememberMe?: boolean;
    };

    const user = users.find((u) => u.email === body.email);

    // Same response for both failure modes — no user enumeration.
    if (!user || user.password !== body.password) {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const refreshToken = issueRefreshToken(user.id);
    const maxAge = body.rememberMe ? `; Max-Age=2592000` : '';

    return HttpResponse.json(
      { accessToken: issueAccessToken(user.id), user: toDto(user) },
      {
        status: 200,
        headers: {
          'Set-Cookie': `rt=${refreshToken}; Path=/; HttpOnly; SameSite=Lax${maxAge}`,
        },
      },
    );
  }),

  http.post(api('/auth/refresh'), async ({ cookies }) => {
    await simulate(NETWORK.normal);

    const token = cookies['rt'];
    if (!token) {
      return HttpResponse.json({ message: 'No session' }, { status: 401 });
    }

    const record = refreshTokens.get(token);

    // REUSE DETECTION: token not found but family known-revoked, or already rotated.
    if (!record) {
      return HttpResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
    }
    if (revokedFamilies.has(record.family)) {
      return HttpResponse.json({ message: 'Token family revoked' }, { status: 401 });
    }

    // ROTATE: old token dies now.
    refreshTokens.delete(token);
    const next = issueRefreshToken(record.userId, record.family);

    const user = users.find((u) => u.id === record.userId);
    if (!user) return HttpResponse.json({ message: 'No session' }, { status: 401 });

    return HttpResponse.json(
      { accessToken: issueAccessToken(user.id), user: toDto(user) },
      {
        status: 200,
        headers: { 'Set-Cookie': `rt=${next}; Path=/; HttpOnly; SameSite=Lax` },
      },
    );
  }),

  http.post(api('/auth/logout'), async ({ cookies }) => {
    await simulate(NETWORK.fast);
    const token = cookies['rt'];
    const record = token ? refreshTokens.get(token) : undefined;

    // Kill the whole family, not just this token.
    if (record) {
      revokedFamilies.add(record.family);
      refreshTokens.delete(token!);
    }

    return new HttpResponse(null, {
      status: 204,
      headers: { 'Set-Cookie': `rt=; Path=/; HttpOnly; Max-Age=0` },
    });
  }),
];