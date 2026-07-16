import { Outlet } from 'react-router';
import { AuthBootstrap } from '@/features/auth';

export function RootLayout() {
  return (
    <AuthBootstrap>
      <Outlet />
    </AuthBootstrap>
  );
}