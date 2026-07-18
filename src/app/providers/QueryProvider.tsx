// src/app/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';
import { retryPolicy, retryDelay } from '@/shared/lib/retry';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: retryPolicy,
      retryDelay,
      refetchOnWindowFocus: import.meta.env.PROD,
    },
    mutations: {
      // Mutations are NOT retried by default — most aren't idempotent.
      retry: false,
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}