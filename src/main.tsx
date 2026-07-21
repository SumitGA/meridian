// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { initVitals } from './shared/lib/vitals';
import '@/app/styles/index.css';

async function bootstrap() {
  // Raw import.meta.env — Vite inlines this literal at build time, so with
  // mocks off the whole branch (and its dynamic import) is tree-shaken away.
  // The Zod-validated `env` object cannot be statically analyzed by the bundler.
  if (import.meta.env.VITE_ENABLE_MOCKS === 'true') {
    const { worker } = await import('@/test/mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      quiet: false,
    });
  }
  initVitals();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();