// src/features/projects/hooks/useCanEditProject.ts
import { useAuth, usePermissions } from '@/features/auth';
import { canEditProject } from '../model/policies';
import type { Project } from '../model/types';

/**
 * Adapter: pulls infrastructure values (current user, permissions) out of
 * React context and feeds them to the pure `canEditProject` rule.
 * The decision logic lives in the domain; this hook is just wiring.
 */
export function useCanEditProject(project: Project | undefined): boolean {
  const { user } = useAuth();
  const { can } = usePermissions();

  if (!project || !user) return false;

  return canEditProject(project, user, can('project:edit'));
}