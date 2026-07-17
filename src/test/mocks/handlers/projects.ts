// src/test/mocks/handlers/projects.ts
import { http, HttpResponse } from 'msw';
import { env } from '@/shared/config/env';
import { projects, type MockProject } from '../db';
import { requireAuth } from './auth';
import { simulate, NETWORK } from '../latency';

const api = (path: string) => `${env.VITE_API_URL}${path}`;

export const projectHandlers = [
  http.get(api('/projects'), async ({ request }) => {
    await simulate(NETWORK.normal);

    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const q = url.searchParams.get('q')?.toLowerCase();

    let result: MockProject[] = [...projects];
    if (status) result = result.filter((p) => p.status === status);
    if (q) result = result.filter((p) => p.name.toLowerCase().includes(q));

    return HttpResponse.json({ items: result, total: result.length });
  }),

  http.post(api('/projects'), async ({ request }) => {
    await simulate(NETWORK.slow);

    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    // Server-side authorization. The client's ProtectedRoute is NOT this.
    if (auth.user.role === 'user') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = (await request.json()) as { name: string; key: string };

    if (projects.some((p) => p.key === body.key)) {
      return HttpResponse.json(
        { message: 'Project key already exists', field: 'key' },
        { status: 409 },
      );
    }

    const created: MockProject = {
      id: crypto.randomUUID(),
      name: body.name,
      key: body.key,
      status: 'active',
      ownerId: auth.user.id,
      createdAt: new Date().toISOString(),
    };
    projects.unshift(created);

    return HttpResponse.json(created, { status: 201 });
  }),
];