// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { env } from '@/shared/config/env';
import '@/app/styles/index.css';

async function bootstrap() {
  if (env.VITE_ENABLE_MOCKS) {
    const { worker } = await import('@/test/mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      quiet: false,
    });
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();