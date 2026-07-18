// src/shared/lib/errors.test.ts
import { describe, it, expect } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import { toAppError, AppError } from '../errors';

// Build a realistic AxiosError with a response.
function axiosResponseError(status: number, data: unknown = {}): AxiosError {
  const err = new AxiosError('Request failed');
  err.response = {
    status,
    data,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
  };
  return err;
}

function axiosNetworkError(code?: string): AxiosError {
  const err = new AxiosError('Network Error');
  err.code = code;
  // no response = never reached server
  return err;
}

describe('toAppError', () => {
  it('passes an existing AppError through unchanged', () => {
    const original = new AppError({ kind: 'forbidden', message: 'no' });
    expect(toAppError(original)).toBe(original);
  });

  it('maps a missing response to network, retryable', () => {
    const e = toAppError(axiosNetworkError());
    expect(e.kind).toBe('network');
    expect(e.retryable).toBe(true);
  });

  it('maps ECONNABORTED to timeout', () => {
    expect(toAppError(axiosNetworkError('ECONNABORTED')).kind).toBe('timeout');
  });

  it('maps 401 to unauthorized, not retryable', () => {
    const e = toAppError(axiosResponseError(401));
    expect(e.kind).toBe('unauthorized');
    expect(e.retryable).toBe(false);
  });

  it('maps 403 to forbidden', () => {
    expect(toAppError(axiosResponseError(403)).kind).toBe('forbidden');
  });

  it('extracts field errors from a 409', () => {
    const e = toAppError(axiosResponseError(409, { message: 'Key taken', field: 'key' }));
    expect(e.kind).toBe('conflict');
    expect(e.fields).toEqual([{ field: 'key', message: 'Key taken' }]);
  });

  it('maps 5xx to server, retryable', () => {
    const e = toAppError(axiosResponseError(503));
    expect(e.kind).toBe('server');
    expect(e.retryable).toBe(true);
  });

  it('maps an unknown non-axios throw to unknown, not retryable', () => {
    const e = toAppError(new Error('boom'));
    expect(e.kind).toBe('unknown');
    expect(e.retryable).toBe(false);
  });

  it('never surfaces a raw server message for 500', () => {
    const e = toAppError(axiosResponseError(500, { message: 'NullPointerException at line 42' }));
    // The internal detail must NOT become the user message.
    expect(e.message).not.toContain('NullPointerException');
  });
});