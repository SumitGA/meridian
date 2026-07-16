import type { AuthBridge } from '@/shared/lib/http';
import { useAuthStore } from '../stores/authStore';
import { refresh } from './authApi';

export const authBridge: AuthBridge = {
  getAccessToken: () => useAuthStore.getState().accessToken,

  refresh: async () => {
    try {
      const { accessToken, user } = await refresh();
      useAuthStore.getState().setSession(accessToken, user);
      return accessToken;
    } catch {
      return null;
    }
  },

  onAuthFailure: () => useAuthStore.getState().clear(),
};