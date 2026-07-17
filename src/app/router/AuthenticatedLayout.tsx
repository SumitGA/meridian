import { Outlet } from 'react-router';
import { AuthBootstrap } from '@/features/auth';

export function AuthenticatedLayout() {
  return (
    <AuthBootstrap>
      <Outlet />
    </AuthBootstrap>
  );
}