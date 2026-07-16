import { create } from 'zustand';
import type { User } from '../model/types';

export type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'anonymous';

interface AuthState {
    accessToken: string | null;
    user: User | null;
    status: AuthStatus;
    setSession: (token: string, user: User) => void;
    setToken: (token: string) => void;
    clear: () => void;
    setStatus: (status: AuthStatus) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    user: null,
    status: 'idle', 
    setSession: (accessToken, user) => set({ accessToken, user, status: 'authenticated' }),
    setToken: (accessToken) => set({ accessToken }),
    clear: () => set({accessToken: null, user: null, status: 'anonymous'}),
    setStatus: (status) => set({status}),
}));
