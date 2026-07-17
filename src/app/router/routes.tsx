import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './RootLayout';
import { AuthenticatedLayout } from './AuthenticatedLayout';
import { LoginPage, ProtectedRoute } from '@/features/auth';
import { ProjectsPage } from '@/features/projects';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public — renders instantly, no boot refresh.
      { path: '/login', element: <LoginPage /> },
      { path: '/forbidden', element: <div className="p-8">403 — Forbidden</div> },

      // Everything below waits for the silent refresh.
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
        ],
      },

      { path: '*', element: <div className="p-8">404 — Not found</div> },
    ],
  },
]);