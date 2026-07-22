// src/features/projects/routes/ProjectsPage.tsx
import { useState } from 'react';
import { useEffect } from 'react';
import { BulkActionBar } from '../components/BulkActionBar';
import { Can, useAuth } from '@/features/auth';
import { useProjects } from '../api/useProjects';
import { CreateProjectForm } from '../components/CreateProjectForm';
import type { ProjectStatus } from '../model/types';
import { ErrorState } from '@/shared/ui';
import { SelectableProjectsTable } from '../components/SelectableProjectsTable';
import { useSelectionStore } from '../stores/selectionStore';

export function ProjectsPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<ProjectStatus | undefined>(undefined);
  const [creating, setCreating] = useState(false);
  // src/features/projects/routes/ProjectsPage.tsx — update the destructure
  const { data, isPending, isError, error, refetch } = useProjects({ status });
  const clearSelection = useSelectionStore((s) => s.clear);

  // Clear selection when the filter change - selected rows may no longer be visible

  useEffect(() => {
    clearSelection();
  }, [status, clearSelection]);

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
      <BulkActionBar />
      {isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : (
        <SelectableProjectsTable projects={data?.items ?? []} isLoading={isPending} />
      )}

    </main>
  );
}