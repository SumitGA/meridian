// src/features/projects/api/useCreateProject.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from './projectsApi';
import { projectKeys } from './projectKeys';

export function useCreateProject() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      // Invalidate the LIST prefix. Every filter variant refetches; details untouched.
      void qc.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}