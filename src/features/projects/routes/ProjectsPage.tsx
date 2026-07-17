// src/features/projects/routes/ProjectsPage.tsx
import { useState } from 'react';
import { useAuth } from '@/features/auth';
import { useProjects } from '../api/useProjects';
import type { ProjectStatus } from '../model/types';

export function ProjectsPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<ProjectStatus | undefined>(undefined);
  const { data, isPending, isError, refetch, isFetching } = useProjects({ status });

  return (
    <main className="p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-slate-600">
            {user?.name} · {user?.role}
          </p>
        </div>
        <select
          className="rounded border border-slate-300 px-3 py-2 text-sm"
          value={status ?? ''}
          onChange={(e) =>
            setStatus((e.target.value || undefined) as ProjectStatus | undefined)
          }
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </header>

      {isPending && (
        <ul className="flex flex-col gap-2" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="h-16 animate-pulse rounded bg-slate-100" />
          ))}
        </ul>
      )}

      {isError && (
        <div role="alert" className="rounded border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">Couldn’t load projects.</p>
          <button
            onClick={() => void refetch()}
            className="mt-2 text-sm font-medium text-red-900 underline"
          >
            Retry
          </button>
        </div>
      )}

      {data && (
        <ul className="flex flex-col gap-2" aria-busy={isFetching}>
          {data.items.map((p) => (
            <li key={p.id} className="rounded border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{p.name}</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">{p.key}</span>
              </div>
              <span className="text-xs text-slate-500">{p.status}</span>
            </li>
          ))}
          {data.items.length === 0 && (
            <li className="rounded border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              No projects match this filter.
            </li>
          )}
        </ul>
      )}
    </main>
  );
}