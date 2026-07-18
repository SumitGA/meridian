// src/features/auth/routes/LoginPage.tsx
import { Navigate, useLocation } from 'react-router';
import { LoginForm } from '../components/LoginForm';
import { GoogleLoginButton } from '../components/GoogleLoginButton';
import { useAuthStore } from '../stores/authStore';

export function LoginPage() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;

  if (user) return <Navigate to="/projects" replace />;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold">Meridian</h1>

        <GoogleLoginButton returnTo={from} />

        <div className="my-6 flex items-center gap-3">
          <hr className="flex-1 border-slate-200" />
          <span className="text-xs text-slate-400">or</span>
          <hr className="flex-1 border-slate-200" />
        </div>

        <LoginForm />
      </div>
    </main>
  );
}