// src/features/projects/components/ProjectsTable.tsx
import dayjs from 'dayjs';
import { DataTable, type Column } from '@/shared/ui';
import type { Project } from '../model/types';
import { ProjectRowActions } from './ProjectRowActions';

const columns: readonly Column<Project>[] = [
  {
    id: 'name',
    header: 'Project',
    cell: (p) => <span className="font-medium text-slate-900">{p.name}</span>,
  },
  {
    id: 'key',
    header: 'Key',
    width: '100px',
    cell: (p) => (
      <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs">{p.key}</span>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    width: '120px',
    cell: (p) => (
      <span
        className={
          p.status === 'active'
            ? 'text-emerald-700'
            : 'text-slate-500'
        }
      >
        {p.status}
      </span>
    ),
  },
  {
    id: 'created',
    header: 'Created',
    width: '140px',
    cell: (p) => (
      <span className="text-slate-500">{dayjs(p.createdAt).format('D MMM YYYY')}</span>
    ),
  },
];

interface Props {
  projects: readonly Project[];
  isLoading: boolean;
}

export function ProjectsTable({ projects, isLoading }: Props) {
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