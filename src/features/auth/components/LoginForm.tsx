import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginRequestSchema } from '../model/schemas';
import type { LoginRequest } from '../model/types';
import { useLogin } from '../api/useLogin';

export function LoginForm() {
  const { mutate, isPending, isError } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutate(data))}
      className="mx-auto flex w-full max-w-sm flex-col gap-4"
      noValidate
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          className="rounded border border-slate-300 px-3 py-2"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && (
          <span role="alert" className="text-xs text-red-600">{errors.email.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="rounded border border-slate-300 px-3 py-2"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && (
          <span role="alert" className="text-xs text-red-600">{errors.password.message}</span>
        )}
      </div>

      {isError && (
        <p role="alert" className="text-sm text-red-600">
          Invalid email or password.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}