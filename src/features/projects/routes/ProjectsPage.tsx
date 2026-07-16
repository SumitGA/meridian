import { useAuth } from '@/features/auth';

export function ProjectsPage() {
  const { user } = useAuth();
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <p className="mt-2 text-slate-600">
        Signed in as {user?.name} ({user?.role})
      </p>
    </main>
  );
}