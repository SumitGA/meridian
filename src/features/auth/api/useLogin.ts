import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { login } from './authApi';
import { useAuthStore } from '../stores/authStore';
import type { LoginRequest } from '../model/types';

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: LoginRequest) => login(body),
    onSuccess: ({ accessToken, user }) => {
      setSession(accessToken, user);
      qc.clear(); // never leak the previous user's cache
      void navigate('/projects', { replace: true });
    },
  });
}