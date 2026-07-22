// src/test/mocks/handlers/projects-bulk.ts
import { http, HttpResponse } from 'msw';
import { env } from '@/shared/config/env';
import { projects } from '../db';
import { requireAuth } from './auth';
import { simulate, NETWORK } from '../latency';

const api = (path: string) => `${env.VITE_API_URL}${path}`;

export const bulkHandlers = [
  http.patch(api('/projects/bulk-archive'), async ({ request }) => {
    await simulate(NETWORK.slow); // slow enough to SEE the optimistic update

    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    if (auth.user.role === 'user') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = (await request.json()) as { ids: string[] };

    // FAILURE SWITCH: if any selected project has key ending in '0', reject the
    // whole batch. This lets you deliberately trigger rollback to see it work.
    const willFail = body.ids.some((id) => {
      const p = projects.find((proj) => proj.id === id);
      return p?.key === 'BIL';
    });

    if (willFail) {
      return HttpResponse.json(
        { message: 'One or more projects could not be archived.' },
        { status: 409 },
      );
    }

    // Success: mutate the mock db.
    for (const id of body.ids) {
      const p = projects.find((proj) => proj.id === id);
      if (p) p.status = 'archived';
    }

    return HttpResponse.json({ archived: body.ids });
  }),
];