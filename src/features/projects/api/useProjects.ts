// src/features/projects/api/useProjects.ts
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from './projectsApi';
import { projectKeys, type ProjectFilters } from './projectKeys';

export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: ({ signal }) => fetchProjects(filters, signal),
  });
}