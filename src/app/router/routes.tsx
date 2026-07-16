import { createBrowserRouter } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Meridian</div>,
    errorElement: <div>Route error</div>,
  },
]);