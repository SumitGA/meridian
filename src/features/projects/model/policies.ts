import type { User } from "@/features/auth";
import type { Project } from './types';

export function isProjectOwner(project: Project, user: User): boolean {
    return project.ownerId === user.id
}

export function canEditProject(project: Project, user: User, hasEditPermission: boolean): boolean {
    return hasEditPermission || isProjectOwner(project, user)
}