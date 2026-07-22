// src/features/projects/components/SelectableProjectsTable.tsx
import dayjs from 'dayjs';
import { DataTable, type Column } from '@/shared/ui';
import { useSelectionStore } from '../stores/selectionStore';
import { ProjectRowActions } from './ProjectRowActions';
import type { Project } from '../model/types';

function SelectCell({ project }: { project: Project }) {
  // Subscribe to ONLY this row's selection state. Selecting row A doesn't
  // re-render row B — Zustand's selector granularity handles this.
  const isSelected = useSelectionStore((s) => s.selectedIds.has(project.id));
  const toggle = useSelectionStore((s) => s.toggle);

  return (
    <input
      type="checkbox"
      checked={isSelected}
      onChange={() => toggle(project.id)}
      aria-label={`Select ${project.name}`}
      className="rounded border-slate-300"
    />
  );
}

interface Props {
  projects: readonly Project[];
  isLoading: boolean;
}

export function SelectableProjectsTable({ projects, isLoading }: Props) {
  const selectAll = useSelectionStore((s) => s.selectAll);
  const selectedIds = useSelectionStore((s) => s.selectedIds);
  const allIds = projects.map((p) => p.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));

  const columns: readonly Column<Project>[] = [
    {
      id: 'select',
      width: '48px',
      header: (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={() => selectAll(allIds)}
          aria-label="Select all"
          className="rounded border-slate-300"
        />
      ),
      cell: (p) => <SelectCell project={p} />,
    },
    {
      id: 'name',
      header: 'Project',
      cell: (p) => <span className="font-medium text-slate-900">{p.name}</span>,
    },
    {
      id: 'key',
      header: 'Key',
      width: '100px',
      cell: (p) => <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs">{p.key}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      width: '120px',
      cell: (p) => (
        <span className={p.status === 'active' ? 'text-emerald-700' : 'text-slate-500'}>{p.status}</span>
      ),
    },
    {
      id: 'created',
      header: 'Created',
      width: '140px',
      cell: (p) => <span className="text-slate-500">{dayjs(p.createdAt).format('D MMM YYYY')}</span>,
    },
  ];

  return (
    <DataTable
      rows={projects}
      columns={columns}
      getRowId={(p) => p.id}
      caption="Projects"
      isLoading={isLoading}
      emptyMessage="No projects match this filter."
      rowActions={(project) => <ProjectRowActions project={project} />}
    />
  );
}