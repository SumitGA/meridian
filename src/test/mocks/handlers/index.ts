// src/test/mocks/handlers/index.ts
import { authHandlers } from './auth';
import { projectHandlers } from './projects';
import { oauthHandlers } from './oauth';
import { bulkHandlers } from './projects-bulk';

export const handlers = [...authHandlers, ...projectHandlers, ...oauthHandlers, ...bulkHandlers];