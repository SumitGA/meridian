import type { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { RootErrorBoundary } from './RootErrorBoundary';

// Order matters. Outermost catches the most.
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <RootErrorBoundary>
      <ThemeProvider>
        <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
    </RootErrorBoundary>
  );
}