// src/features/projects/components/CreateProjectForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProjectSchema } from '../model/schemas';
import type { CreateProjectInput } from '../model/types';
import { useCreateProject } from '../api/useCreateProject';
import { AppError } from '@/shared/lib/errors';

interface Props {
  onSuccess?: () => void;
}

export function CreateProjectForm({ onSuccess }: Props) {
  const { mutate, isPending } = useCreateProject();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: '', key: '' },
  });

  const onSubmit = (data: CreateProjectInput) => {
    mutate(data, {
      onSuccess: () => {
        reset();          // clear on SUCCESS
        onSuccess?.();
      },
      onError: (error) => {
      if (error instanceof AppError) {
        // Field-level errors from conflict/validation map straight to RHF.
        if (error.fields.length > 0) {
          for (const f of error.fields) {
            setError(f.field as keyof CreateProjectInput, {
              type: 'server',
              message: f.message,
            });
          }
          return;
        }
        // Everything else → form-level root error, with a human message.
        setError('root', { message: error.message });
        return;
      }
        setError('root', { message: 'Couldn’t create project. Please try again.' });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">Name</label>
        <input
          id="name"
          className="rounded border border-slate-300 px-3 py-2"
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        {errors.name && (
          <span role="alert" className="text-xs text-red-600">{errors.name.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="key" className="text-sm font-medium">Key</label>
        <input
          id="key"
          className="rounded border border-slate-300 px-3 py-2 font-mono uppercase"
          aria-invalid={!!errors.key}
          {...register('key')}
        />
        {/* Zod errors and server errors render through the SAME slot */}
        {errors.key && (
          <span role="alert" className="text-xs text-red-600">{errors.key.message}</span>
        )}
      </div>

      {errors.root && (
        <p role="alert" className="text-sm text-red-600">{errors.root.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? 'Creating…' : 'Create project'}
      </button>
    </form>
  );
}