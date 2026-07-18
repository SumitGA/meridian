// src/shared/lib/retry.ts
import { AppError } from './errors';

/**
 * TanStack Query's `retry` option, driven by the error's own policy.
 * The error already knows whether it's worth retrying — we just read it.
 */
export function retryPolicy(failureCount: number, error: unknown): boolean {
  if (error instanceof AppError) {
    if (!error.retryable) return false;
    // Rate-limit: retry, but fewer times and it'll back off.
    if (error.kind === 'rateLimited') return failureCount < 2;
    return failureCount < 3;
  }
  // Unclassified — retry conservatively.
  return failureCount < 1;
}

/** Exponential backoff with jitter, capped. */
export function retryDelay(attemptIndex: number): number {
  const base = Math.min(1000 * 2 ** attemptIndex, 30_000);
  const jitter = Math.random() * 300; // decorrelate concurrent retries
  return base + jitter;
}