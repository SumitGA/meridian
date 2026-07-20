// src/shared/lib/__tests__/http.test.ts
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { http as mswHttp, HttpResponse } from 'msw';
import { http, installAuthInterceptors, type AuthBridge } from '../http';
import { server } from '@/test/mocks/server';
import { env } from '@/shared/config/env';

const api = (p: string) => `${env.VITE_API_URL}${p}`;

describe('auth interceptor — single-flight refresh', () => {
  let uninstall: () => void;

  // Mock<Signature> gives vi.fn() the exact type AuthBridge.refresh expects.
  // Without the generic, vi.fn() is too loosely typed to assign to `refresh`.
  let refreshMock: Mock<() => Promise<string | null>>;
  let currentToken: string;

  beforeEach(() => {
    currentToken = 'expired-token';
    refreshMock = vi.fn<() => Promise<string | null>>(async () => {
        currentToken = 'new-access-token';
        return 'new-access-token';
    });

    const bridge: AuthBridge = {
        getAccessToken: () => currentToken,   // reflects state, like the real store
        refresh: refreshMock,
        onAuthFailure: vi.fn(),
    };

    uninstall = installAuthInterceptors(bridge);
  });

  afterEach(() => {
    uninstall();          // eject interceptors so they don't stack across tests
    vi.restoreAllMocks();
  });

  it('triggers exactly one refresh for N concurrent 401s', async () => {
    // Stateful handler: 401 until a request arrives carrying the refreshed
    // token, then 200. Proves the retry re-set the Authorization header AND
    // that all concurrent requests shared one refresh.
    server.use(
      mswHttp.get(api('/test-concurrent'), ({ request }) => {
        const auth = request.headers.get('Authorization');
        if (auth === 'Bearer new-access-token') {
          return HttpResponse.json({ ok: true });
        }
        return new HttpResponse(null, { status: 401 });
      }),
    );

    // Array.from builds all 10 promises SYNCHRONOUSLY — they're in flight
    // before any await. That overlap is what makes this a single-flight test
    // rather than 10 sequential requests.
    const requests = Array.from({ length: 10 }, () => http.get('/test-concurrent'));


    await Promise.all(requests);

    // The specification, as one line. Fails the instant `inFlight ??=` is deleted.
    expect(refreshMock).toHaveBeenCalledTimes(1);
  });

  it('refreshes again for a SECOND burst (inFlight resets)', async () => {
    server.use(
      mswHttp.get(api('/test-concurrent'), ({ request }) => {
        const auth = request.headers.get('Authorization');
        return auth === 'Bearer new-access-token'
          ? HttpResponse.json({ ok: true })
          : new HttpResponse(null, { status: 401 });
      }),
    );

    await Promise.all(Array.from({ length: 5 }, () => http.get('/test-concurrent')));

    currentToken = 'expired-token';

    await Promise.all(Array.from({ length: 5 }, () => http.get('/test-concurrent')));

    // Two bursts → two refreshes. Catches a permanently-stuck inFlight,
    // which the single-burst test cannot. This is the "second clause" from
    expect(refreshMock).toHaveBeenCalledTimes(2);
  });
});