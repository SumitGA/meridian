// src/features/auth/routes/OAuthCallbackPage.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { consumePending } from '../lib/oauthState';
import { exchangeGoogleCode } from '../api/oauthApi';
import { useAuthStore } from '../stores/authStore';
import { oauthCallbackParamsSchema, oauthErrorParamsSchema } from '../model/oauth';

type Phase = 'exchanging' | 'error';

export function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [phase, setPhase] = useState<Phase>('exchanging');
  const [message, setMessage] = useState('Completing sign-in…');

  // StrictMode double-invokes effects. consumePending() is single-use —
  // the second invocation would find nothing and report a spurious failure.
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const params = Object.fromEntries(searchParams.entries());

    // 1. Provider-reported error (user hit Cancel, etc.)
    const asError = oauthErrorParamsSchema.safeParse(params);
    if (asError.success) {
      setPhase('error');
      setMessage(
        asError.data.error === 'access_denied'
          ? 'Sign-in was cancelled.'
          : 'Sign-in failed. Please try again.',
      );
      return;
    }

    // 2. Shape check
    const asCallback = oauthCallbackParamsSchema.safeParse(params);
    if (!asCallback.success) {
      setPhase('error');
      setMessage('Invalid sign-in response.');
      return;
    }

    // 3. Read-and-destroy the pending record
    const pending = consumePending();
    if (!pending) {
      setPhase('error');
      setMessage('Sign-in session expired. Please try again.');
      return;
    }

    // 4. CSRF check. Constant-time isn't needed — this is a client-side
    //    comparison of a value the attacker already can't guess.
    if (asCallback.data.state !== pending.state) {
      setPhase('error');
      setMessage('Sign-in could not be verified. Please try again.');
      return;
    }

    // 5. Exchange. The verifier proves we're the client that started this.
    void exchangeGoogleCode({
      code: asCallback.data.code,
      codeVerifier: pending.verifier,
    })
      .then(({ accessToken, user }) => {
        useAuthStore.getState().setSession(accessToken, user);
        qc.clear();
        // `replace` — the code must not survive in browser history.
        void navigate(pending.returnTo, { replace: true });
      })
      .catch(() => {
        setPhase('error');
        setMessage('Sign-in failed. Please try again.');
      });
  }, [searchParams, navigate, qc]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className={phase === 'error' ? 'text-sm text-red-600' : 'text-sm text-slate-600'}>
          {message}
        </p>
        {phase === 'error' && (
          <button
            onClick={() => void navigate('/login', { replace: true })}
            className="rounded bg-slate-900 px-4 py-2 text-sm text-white"
          >
            Back to sign in
          </button>
        )}
      </div>
    </main>
  );
}