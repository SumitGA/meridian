// src/test/mocks/handlers/oauth.ts
import { http, HttpResponse } from 'msw';
import { env } from '@/shared/config/env';
import { users, authCodes, refreshTokens } from '../db';
import { simulate, NETWORK } from '../latency';

const api = (path: string) => `${env.VITE_API_URL}${path}`;

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256Base64Url(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return base64UrlEncode(new Uint8Array(digest));
}

export const oauthHandlers = [
  http.post(api('/auth/oauth/google'), async ({ request }) => {
    await simulate(NETWORK.slow);

    const body = (await request.json()) as {
      code: string;
      codeVerifier: string;
      redirectUri: string;
    };

    const record = authCodes.get(body.code);

    // Single-use: the code dies on first redemption, valid or not.
    authCodes.delete(body.code);

    if (!record || Date.now() > record.expiresAt) {
      return HttpResponse.json({ message: 'Invalid authorization code' }, { status: 400 });
    }

    // THE PKCE CHECK — this is the whole module in three lines.
    const derived = await sha256Base64Url(body.codeVerifier);
    if (derived !== record.challenge) {
      return HttpResponse.json({ message: 'Invalid code_verifier' }, { status: 400 });
    }

    if (body.redirectUri !== record.redirectUri) {
      return HttpResponse.json({ message: 'redirect_uri mismatch' }, { status: 400 });
    }

    const user = users.find((u) => u.id === record.userId);
    if (!user) return HttpResponse.json({ message: 'Unknown user' }, { status: 400 });

    const refreshToken = crypto.randomUUID();
    refreshTokens.set(refreshToken, { userId: user.id, family: crypto.randomUUID() });

    return HttpResponse.json(
      {
        accessToken: `at.${user.id}.${Date.now() + 10_000}`,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
      {
        status: 200,
        headers: { 'Set-Cookie': `rt=${refreshToken}; Path=/; HttpOnly; SameSite=Lax` },
      },
    );
  }),
];