// src/features/auth/hooks/useGoogleLogin.ts
import { useCallback, useState } from 'react';
import { env } from '@/shared/config/env';
import { generateCodeVerifier, deriveCodeChallenge, generateRandomString } from '../lib/pkce';
import { savePending } from '../lib/oauthState';
import { getAuthorizeUrl } from '../model/oauth';

export function useGoogleLogin() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const start = useCallback(async (returnTo = '/projects') => {
    setIsRedirecting(true);

    const verifier = generateCodeVerifier();
    const challenge = await deriveCodeChallenge(verifier);
    const state = generateRandomString();
    const nonce = generateRandomString();

    // Persist BEFORE redirecting. After this line we lose control of the page.
    savePending({ verifier, state, nonce, returnTo, createdAt: Date.now() });

    const params = new URLSearchParams({
      client_id: env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri: env.VITE_OAUTH_REDIRECT_URI,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      nonce,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      prompt: 'select_account',
    });

    window.location.assign(`${getAuthorizeUrl()}?${params.toString()}`);
  }, []);

  return { start, isRedirecting };
}