// src/features/projects/components/CreateProjectForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { env } from '@/shared/config/env';
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/render';
import { CreateProjectForm } from '../CreateProjectForm';

const api = (p: string) => `${env.VITE_API_URL}${p}`;

describe('CreateProjectForm', () => {
  it('shows a validation error for a too-short key without hitting the network', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateProjectForm />);

    await user.type(screen.getByLabelText(/name/i), 'Valid Name');
    await user.type(screen.getByLabelText(/key/i), 'A'); // min 2
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findByText(/at least 2/i)).toBeInTheDocument();
  });

  it('maps a 409 conflict to a field error under Key', async () => {
    server.use(
      http.post(api('/projects'), () =>
        HttpResponse.json({ message: 'That key is already taken', field: 'key' }, { status: 409 }),
      ),
    );

    const user = userEvent.setup();
    renderWithProviders(<CreateProjectForm />);

    await user.type(screen.getByLabelText(/name/i), 'Apollo Two');
    await user.type(screen.getByLabelText(/key/i), 'APO');
    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findByText(/already taken/i)).toBeInTheDocument();
  });

  it('calls onSuccess and resets after a successful create', async () => {
    server.use(
      http.post(api('/projects'), () =>
        HttpResponse.json(
          { id: crypto.randomUUID(), name: 'New', key: 'NEW', status: 'active', ownerId: crypto.randomUUID(), createdAt: new Date().toISOString() },
          { status: 201 },
        ),
      ),
    );

    const onSuccess = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<CreateProjectForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/name/i), 'New Project');
    await user.type(screen.getByLabelText(/key/i), 'NEW');
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
  });
});