// src/shared/hooks/useErrorMessage.ts
import { AppError, type AppErrorKind } from '@/shared/lib/errors';

const DEFAULT_MESSAGES: Record<AppErrorKind, string> = {
  network: 'Network error. Check your connection and try again.',
  timeout: 'This is taking longer than expected. Try again.',
  unauthorized: 'Your session has expired. Please sign in again.',
  forbidden: 'You don’t have permission to do that.',
  notFound: 'We couldn’t find what you were looking for.',
  conflict: 'This conflicts with existing data.',
  validation: 'Please check the highlighted fields.',
  rateLimited: 'Too many requests. Please wait a moment.',
  server: 'Something went wrong on our end. We’re looking into it.',
  canceled: '',
  unknown: 'An unexpected error occurred.',
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message || DEFAULT_MESSAGES[error.kind];
  return DEFAULT_MESSAGES.unknown;
}