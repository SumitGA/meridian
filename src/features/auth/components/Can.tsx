// src/features/auth/components/Can.tsx
import type { ReactNode } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import type { Permission } from '../model/permissions';

interface Props {
  /** Single permission, or several — all must be held unless `any` is set. */
  permission: Permission | Permission[];
  any?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Can({ permission, any = false, children, fallback = null }: Props) {
  const { can, canAny, canAll } = usePermissions();

  const list = Array.isArray(permission) ? permission : [permission];
  const allowed = list.length === 1 ? can(list[0]!) : any ? canAny(list) : canAll(list);

  return <>{allowed ? children : fallback}</>;
}