// src/features/projects/api/projectsApi.ts
import { http } from '@/shared/lib/http';
import { projectListSchema, projectSchema } from '../model/schemas';
import type { CreateProjectInput, Project, ProjectList } from '../model/types';
import type { ProjectFilters } from './projectKeys';

export async function fetchProjects(
  filters: ProjectFilters,
  signal?: AbortSignal,
): Promise<ProjectList> {
  const res = await http.get('/projects', { params: filters, signal });
  return projectListSchema.parse(res.data);
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const res = await http.post('/projects', input);
  return projectSchema.parse(res.data);
}