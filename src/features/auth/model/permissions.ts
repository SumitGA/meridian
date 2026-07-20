// src/features/auth/model/permissions.ts
import type { Role } from './types';

/**
 * Permissions are VERBS ON NOUNS, named after what the product does.
 * Never name a permission after a role ("adminAccess") — that defeats the indirection.
 */
export const PERMISSIONS = [
  'project:view',
  'project:create',
  'project:edit',
  'project:archive',
  'project:delete',
  'member:view',
  'member:invite',
  'member:remove',
  'admin:access',
  'billing:manage',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/**
 * The single source of truth. Adding a role = adding one entry here.
 * This mirrors the server's policy — the server is authoritative.
 */
const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  admin: PERMISSIONS,

  manager: [
    'project:view',
    'project:create',
    'project:edit',
    'project:archive',
    'member:view',
    'member:invite',
  ],

  user: ['project:view', 'member:view'],

  auditor: ['project:view', 'member:view'],
};

export function permissionsFor(role: Role): ReadonlySet<Permission> {
  return new Set(ROLE_PERMISSIONS[role]);
}