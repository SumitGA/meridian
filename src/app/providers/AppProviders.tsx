import type { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { RootErrorBoundary } from './RootErrorBoundary';
import { HttpProvider } from './HttpProvider';

// Order matters. Outermost catches the most.
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <RootErrorBoundary>
      <ThemeProvider>
        <HttpProvider>
          <QueryProvider>{children}</QueryProvider>
        </HttpProvider>
      </ThemeProvider>
    </RootErrorBoundary>
  );
}