import { delay } from 'msw';

/**
 * Dev default is deliberately slow. If you never feel your loading states,
 * you never build them. Override per-handler when a test needs speed.
 */
export const NETWORK = {
  fast: 100,
  normal: 400,
  slow: 1500,
} as const;

export const simulate = (ms: number = NETWORK.normal) => delay(ms);