// src/app/router/routes.tsx
import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './RootLayout';
import { AuthenticatedLayout } from './AuthenticatedLayout';
import {
  LoginPage,
  OAuthCallbackPage,
  MockConsentPage,
  ProtectedRoute,
  permissionsFor,
} from '@/features/auth';
import { ProjectsPage } from '@/features/projects';
import { AdminPage } from '@/features/admin';
import { env } from '@/shared/config/env';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/auth/callback', element: <OAuthCallbackPage /> },
      { path: '/forbidden', element: <div className="p-8">403 — Forbidden</div> },
      ...(env.VITE_ENABLE_MOCKS
        ? [{ path: '/mock-consent', element: <MockConsentPage /> }]
        : []),
      {
        element: <AuthenticatedLayout />,
        children: [
          {
            element: <ProtectedRoute />,
            children: [
              { path: '/', element: <Navigate to="/projects" replace /> },
              { path: '/projects', element: <ProjectsPage /> },
            ],
          },
          {
            element: (
              <ProtectedRoute authorize={(u) => permissionsFor(u.role).has('admin:access')} />
            ),
            children: [{ path: '/admin', element: <AdminPage /> }],
          },
        ],
      },
      { path: '*', element: <div className="p-8">404 — Not found</div> },
    ],
  },
]);