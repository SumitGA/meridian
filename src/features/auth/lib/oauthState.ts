// src/features/auth/lib/oauthState.ts

/**
 * Ephemeral PKCE + state, scoped to one in-flight OAuth attempt.
 *
 * sessionStorage is a deliberate, bounded compromise: the verifier MUST
 * survive a full-page redirect, so in-memory is impossible. It is not a
 * credential on its own — it's useless without the matching auth code.
 * Cleared immediately on consumption, success or failure.
 */
const KEY = 'meridian.oauth.pending';

export interface PendingOAuth {
  verifier: string;
  state: string;
  nonce: string;
  returnTo: string;
  createdAt: number;
}

const MAX_AGE_MS = 10 * 60 * 1000;

export function savePending(pending: PendingOAuth): void {
  sessionStorage.setItem(KEY, JSON.stringify(pending));
}

/** Reads AND deletes. Single-use by construction — a replay finds nothing. */
export function consumePending(): PendingOAuth | null {
  const raw = sessionStorage.getItem(KEY);
  sessionStorage.removeItem(KEY);

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PendingOAuth;
    if (Date.now() - parsed.createdAt > MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPending(): void {
  sessionStorage.removeItem(KEY);
}