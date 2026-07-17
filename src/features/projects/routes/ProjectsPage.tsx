// src/features/projects/routes/ProjectsPage.tsx
import { useState } from 'react';
import { Can, useAuth } from '@/features/auth';
import { useProjects } from '../api/useProjects';
import { ProjectsTable } from '../components/ProjectsTable';
import { CreateProjectForm } from '../components/CreateProjectForm';
import type { ProjectStatus } from '../model/types';

export function ProjectsPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<ProjectStatus | undefined>(undefined);
  const [creating, setCreating] = useState(false);
  const { data, isPending, isError, refetch } = useProjects({ status });

  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-slate-600">{user?.name} · {user?.role}</p>
        </div>

        <div className="flex items-center gap-3">
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

          <Can permission="project:create">
            <button
              onClick={() => setCreating((v) => !v)}
              className="rounded bg-slate-900 px-4 py-2 text-sm text-white"
            >
              {creating ? 'Cancel' : 'New project'}
            </button>
          </Can>
        </div>
      </header>

      <Can permission="project:create">
        {creating && (
          <div className="mb-6 rounded border border-slate-200 p-6">
            <CreateProjectForm onSuccess={() => setCreating(false)} />
          </div>
        )}
      </Can>

      {isError ? (
        <div role="alert" className="rounded border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">Couldn’t load projects.</p>
          <button
            onClick={() => void refetch()}
            className="mt-2 text-sm font-medium text-red-900 underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <ProjectsTable projects={data?.items ?? []} isLoading={isPending} />
      )}
    </main>
  );
}