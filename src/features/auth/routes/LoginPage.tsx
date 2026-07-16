import { Navigate } from 'react-router';
import { LoginForm } from '../components/LoginForm';
import { useAuthStore } from '../stores/authStore';

export function LoginPage() {
  const user = useAuthStore((s) => s.user);
  if (user) return <Navigate to="/projects" replace />;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold">Meridian</h1>
        <LoginForm />
      </div>
    </main>
  );
}