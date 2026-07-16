import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '../stores/authStore';
import type { User } from '../model/types';

interface Props {
  /** Optional predicate. ProtectedRoute does NOT know your roles. */
  authorize?: (user: User) => boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ authorize, redirectTo = '/login' }: Props) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (authorize && !authorize(user)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}