import { useMemo } from 'react';
import { useAuthStore } from '../stores/authStore';
import { permissionsFor, type Permission } from '../model/permissions';

export function usePermissions() {
    const user = useAuthStore((s) => s.user );

    return useMemo(() => {
        const granted = user ? permissionsFor(user.role) : new Set<Permission>();

        return {
            can: (permission: Permission) => granted.has(permission),
            canAny: (permissions: Permission[]) => permissions.some((p) => granted.has(p)),
            canAll: (permissions: Permission[]) => permissions.every((p) => granted.has(p)),
        };

    }, [user]);
}