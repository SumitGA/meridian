// src/shared/ui/ErrorState.tsx
import { AppError } from '@/shared/lib/errors';
import { getErrorMessage } from '@/shared/hooks/useErrorMessage';

interface Props {
  error: unknown;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: Props) {
  const message = getErrorMessage(error);
  const isRetryable = error instanceof AppError && error.retryable;

  return (
    <div role="alert" className="rounded border border-red-200 bg-red-50 p-4">
      <p className="text-sm text-red-700">{message}</p>
      {isRetryable && onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm font-medium text-red-900 underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}