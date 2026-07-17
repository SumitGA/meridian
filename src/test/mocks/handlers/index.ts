// src/test/mocks/handlers/index.ts
import { authHandlers } from './auth';
import { projectHandlers } from './projects';

export const handlers = [...authHandlers, ...projectHandlers];