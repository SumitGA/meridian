// src/shared/lib/retry.test.ts
import { describe, it, expect } from 'vitest';
import { retryPolicy, retryDelay } from '../retry';
import { AppError } from '../errors';

const err = (overrides: Partial<ConstructorParameters<typeof AppError>[0]> = {}) =>
  new AppError({ kind: 'server', message: 'x', retryable: true, ...overrides });

describe('retryPolicy', () => {
  it('retries a retryable error up to 3 times', () => {
    expect(retryPolicy(0, err())).toBe(true);
    expect(retryPolicy(2, err())).toBe(true);
    expect(retryPolicy(3, err())).toBe(false); // stop at 3
  });

  it('never retries a non-retryable error', () => {
    expect(retryPolicy(0, err({ retryable: false }))).toBe(false);
  });

  it('retries rateLimited only twice', () => {
    const rl = err({ kind: 'rateLimited' });
    expect(retryPolicy(1, rl)).toBe(true);
    expect(retryPolicy(2, rl)).toBe(false);
  });

  it('retries a non-AppError at most once', () => {
    expect(retryPolicy(0, new Error('raw'))).toBe(true);
    expect(retryPolicy(1, new Error('raw'))).toBe(false);
  });
});

describe('retryDelay', () => {
  it('grows exponentially and caps at 30s', () => {
    expect(retryDelay(0)).toBeGreaterThanOrEqual(1000);
    expect(retryDelay(0)).toBeLessThan(1400); // 1000 + <300 jitter, some margin
    expect(retryDelay(10)).toBeLessThanOrEqual(30_300); // capped + jitter
  });
});