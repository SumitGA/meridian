// vitest.config.ts
import { defineConfig } from 'vitest/config';   // ← vitest, not vite
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['src/test/**', '**/*.config.*', 'src/main.tsx', 'src/**/index.ts'],
    },
  },
});