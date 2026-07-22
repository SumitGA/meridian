// src/features/projects/components/ProjectRowActions.tsx
import { Can } from '@/features/auth';
import { useCanEditProject } from '../hooks/useCanEditProject';
import type { Project } from '../model/types';

export function ProjectRowActions({ project }: { project: Project }) {
  const canEdit = useCanEditProject(project);

  return (
    <div className="flex justify-end gap-2">
      {canEdit && (
        <button
          onClick={() => console.log('edit', project.id)}
          className="text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          Edit
        </button>
      )}
      <Can permission="project:archive">
        <button className="text-xs font-medium text-slate-600 hover:text-slate-900">
          Archive
        </button>
      </Can>
      <Can permission="project:delete">
        <button className="text-xs font-medium text-red-600 hover:text-red-800">
          Delete
        </button>
      </Can>
    </div>
  );
}