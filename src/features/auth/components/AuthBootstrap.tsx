import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import { authBridge } from '../api/authBridge';

/**
 * On hard reload the access token is gone (in-memory by design).
 * Attempt one silent refresh via the HttpOnly cookie before rendering routes.
 */
export function AuthBootstrap({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status !== 'idle') return;
    useAuthStore.getState().setStatus('authenticating');
    void authBridge.refresh().then((token) => {
      if (!token) useAuthStore.getState().clear();
    });
  }, [status]);

  if (status === 'idle' || status === 'authenticating') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-sm text-slate-500">Loading…</span>
      </div>
    );
  }

  return <>{children}</>;
}