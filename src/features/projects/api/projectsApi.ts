// src/features/projects/api/projectsApi.ts
import { http } from '@/shared/lib/http';
import { toAppError } from '@/shared/lib/errors';
import { projectListSchema, projectSchema } from '../model/schemas';
import type { CreateProjectInput, Project, ProjectList } from '../model/types';
import type { ProjectFilters } from './projectKeys';

export async function fetchProjects(
  filters: ProjectFilters,
  signal?: AbortSignal,
): Promise<ProjectList> {
  const res = await http.get('/projects', { params: filters, signal });
  // Zod failure here becomes an `unknown` AppError via the caller's boundary,
  // but we translate explicitly so parse errors are never raw.
  try {
    return projectListSchema.parse(res.data);
  } catch (err) {
    throw toAppError(err);
  }
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  try {
    const res = await http.post('/projects', input);
    return projectSchema.parse(res.data);
  } catch (err) {
    throw toAppError(err);
  }
}