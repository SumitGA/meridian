// src/test/render.tsx
import { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// A fresh QueryClient per render — no cache leaks between tests.
// Retries OFF in tests: we assert error states directly, no backoff waits.
function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: createWrapper(), ...options });
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';