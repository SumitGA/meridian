// src/shared/lib/errors.ts
import axios from 'axios';

/**
 * The closed set of application-level failure modes.
 * Everything above the API layer switches on THIS, never on HTTP status.
 */
export type AppErrorKind =
  | 'network'      // request never reached the server (offline, DNS, CORS)
  | 'timeout'      // server didn't answer in time
  | 'unauthorized' // 401 — not authenticated (session dead)
  | 'forbidden'    // 403 — authenticated, not allowed
  | 'notFound'     // 404
  | 'conflict'     // 409 — state clash (duplicate key, version mismatch)
  | 'validation'   // 422/400 — the request was malformed or rejected per-field
  | 'rateLimited'  // 429
  | 'server'       // 5xx — their fault
  | 'canceled'     // we aborted it (unmount, key change) — NOT an error to show
  | 'unknown';     // anything unclassified — treat as a bug

export interface FieldError {
  field: string;
  message: string;
}

export class AppError extends Error {
  readonly kind: AppErrorKind;
  readonly status: number | null;
  readonly fields: FieldError[];
  /** Whether retrying could plausibly succeed. Policy lives with the error. */
  readonly retryable: boolean;
  /** The original, for logging/Sentry. Never shown to users. */
  readonly cause: unknown;

  constructor(params: {
    kind: AppErrorKind;
    message: string;
    status?: number | null;
    fields?: FieldError[];
    retryable?: boolean;
    cause?: unknown;
  }) {
    super(params.message);
    this.name = 'AppError';
    this.kind = params.kind;
    this.status = params.status ?? null;
    this.fields = params.fields ?? [];
    this.retryable = params.retryable ?? false;
    this.cause = params.cause;
  }
}


interface ServerErrorBody {
  message?: string;
  field?: string;
  fields?: FieldError[];
}

export function toAppError(error: unknown): AppError {
  // Already translated — pass through.
  if (error instanceof AppError) return error;

  if (axios.isCancel(error)) {
    return new AppError({ kind: 'canceled', message: 'Request canceled', retryable: false, cause: error });
  }

  if (axios.isAxiosError(error)) {
    // No response = never reached the server.
    if (!error.response) {
      const kind = error.code === 'ECONNABORTED' ? 'timeout' : 'network';
      return new AppError({
        kind,
        message: kind === 'timeout' ? 'The request timed out.' : 'Network error. Check your connection.',
        retryable: true, // transient by nature
        cause: error,
      });
    }

    const status = error.response.status;
    const body = (error.response.data ?? {}) as ServerErrorBody;

    switch (true) {
      case status === 401:
        return new AppError({ kind: 'unauthorized', message: 'Your session has expired.', status, retryable: false, cause: error });
      case status === 403:
        return new AppError({ kind: 'forbidden', message: 'You don’t have permission to do that.', status, retryable: false, cause: error });
      case status === 404:
        return new AppError({ kind: 'notFound', message: 'Not found.', status, retryable: false, cause: error });
      case status === 409:
        return new AppError({
          kind: 'conflict',
          message: body.message ?? 'This conflicts with existing data.',
          status,
          fields: body.field ? [{ field: body.field, message: body.message ?? 'Already exists' }] : body.fields ?? [],
          retryable: false,
          cause: error,
        });
      case status === 422 || status === 400:
        return new AppError({
          kind: 'validation',
          message: body.message ?? 'Some fields need attention.',
          status,
          fields: body.fields ?? (body.field ? [{ field: body.field, message: body.message ?? 'Invalid' }] : []),
          retryable: false,
          cause: error,
        });
      case status === 429:
        return new AppError({ kind: 'rateLimited', message: 'Too many requests. Please slow down.', status, retryable: true, cause: error });
      case status >= 500:
        return new AppError({ kind: 'server', message: 'Something went wrong on our end.', status, retryable: true, cause: error });
      default:
        return new AppError({ kind: 'unknown', message: 'An unexpected error occurred.', status, retryable: false, cause: error });
    }
  }

  // Not an axios error at all — a bug in our own code, a Zod parse failure, etc.
  return new AppError({
    kind: 'unknown',
    message: 'An unexpected error occurred.',
    retryable: false,
    cause: error,
  });
}