// src/app/router/routes.tsx
import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './RootLayout';
import { AuthenticatedLayout } from './AuthenticatedLayout';
import { LoginPage, ProtectedRoute, permissionsFor } from '@/features/auth';
import { ProjectsPage } from '@/features/projects';
import { AdminPage } from '@/features/admin';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/forbidden', element: <div className="p-8">403 — Forbidden</div> },
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
            // The `authorize` predicate from Module 2. ProtectedRoute never changed.
            element: (
              <ProtectedRoute
                authorize={(user) => permissionsFor(user.role).has('admin:access')}
              />
            ),
            children: [{ path: '/admin', element: <AdminPage /> }],
          },
        ],
      },
      { path: '*', element: <div className="p-8">404 — Not found</div> },
    ],
  },
]);