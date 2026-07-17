// src/features/projects/index.ts
export { ProjectsPage } from './routes/ProjectsPage';
export { ProjectsTable } from './components/ProjectsTable';
export { useProjects } from './api/useProjects';
export { useCreateProject } from './api/useCreateProject';
export type { Project, ProjectStatus, CreateProjectInput } from './model/types';