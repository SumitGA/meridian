// src/features/auth/routes/MockConsentPage.tsx
import { useSearchParams } from 'react-router';
import { users, authCodes } from '@/test/mocks/db';

/** DEV ONLY. Stands in for accounts.google.com. */
export function MockConsentPage() {
  const [params] = useSearchParams();

  const pick = (userId: string) => {
    const code = crypto.randomUUID();
    authCodes.set(code, {
      userId,
      challenge: params.get('code_challenge') ?? '',
      redirectUri: params.get('redirect_uri') ?? '',
      expiresAt: Date.now() + 60_000,
    });
    const redirect = new URL(params.get('redirect_uri')!);
    redirect.searchParams.set('code', code);
    redirect.searchParams.set('state', params.get('state') ?? '');
    window.location.assign(redirect.toString());
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded border border-slate-200 p-6">
        <h1 className="mb-1 text-lg font-semibold">Choose an account</h1>
        <p className="mb-4 text-xs text-slate-500">(mock consent screen)</p>
        <ul className="flex flex-col gap-2">
          {users.map((u) => (
            <li key={u.id}>
              <button
                onClick={() => pick(u.id)}
                className="w-full rounded border border-slate-200 px-4 py-3 text-left text-sm hover:bg-slate-50"
              >
                <span className="font-medium">{u.name}</span>
                <span className="block text-xs text-slate-500">{u.email}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}