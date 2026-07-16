import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './RootLayout';
import { LoginPage, ProtectedRoute } from '@/features/auth';
import { ProjectsPage } from '@/features/projects';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/', element: <Navigate to="/projects" replace /> },
          { path: '/projects', element: <ProjectsPage /> },
        ],
      },
      { path: '/forbidden', element: <div className="p-8">403 — Forbidden</div> },
      { path: '*', element: <div className="p-8">404 — Not found</div> },
    ],
  },
]);