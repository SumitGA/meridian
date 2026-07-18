// src/features/auth/lib/pkce.test.ts
import { describe, it, expect } from 'vitest';
import { generateCodeVerifier, deriveCodeChallenge } from '../pkce';

describe('PKCE', () => {
  it('generates a verifier of RFC-legal length', () => {
    const v = generateCodeVerifier();
    expect(v.length).toBeGreaterThanOrEqual(43);
    expect(v.length).toBeLessThanOrEqual(128);
  });

  it('produces only unreserved base64url characters', () => {
    const v = generateCodeVerifier();
    expect(v).toMatch(/^[A-Za-z0-9\-_]+$/); // no +, /, or =
  });

  it('generates a different verifier each call', () => {
    expect(generateCodeVerifier()).not.toBe(generateCodeVerifier());
  });

  it('derives a stable challenge for a given verifier', async () => {
    const v = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';
    const c1 = await deriveCodeChallenge(v);
    const c2 = await deriveCodeChallenge(v);
    expect(c1).toBe(c2); // deterministic — same input, same hash
  });

  it('derives different challenges for different verifiers', async () => {
    const a = await deriveCodeChallenge(generateCodeVerifier());
    const b = await deriveCodeChallenge(generateCodeVerifier());
    expect(a).not.toBe(b);
  });
});