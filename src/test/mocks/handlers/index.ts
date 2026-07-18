// src/test/mocks/handlers/index.ts
import { authHandlers } from './auth';
import { projectHandlers } from './projects';
import { oauthHandlers } from './oauth';

export const handlers = [...authHandlers, ...projectHandlers, ...oauthHandlers];