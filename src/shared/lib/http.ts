// src/shared/lib/http.ts — FULL FILE
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@/shared/config/env';
import { toAppError } from './errors';

export const http: AxiosInstance = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
  timeout: 15_000,
});

export interface AuthBridge {
  getAccessToken: () => string | null;
  refresh: () => Promise<string | null>;
  onAuthFailure: () => void;
}

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

export function installAuthInterceptors(bridge: AuthBridge): () => void {
  const reqId = http.interceptors.request.use((config) => {
    const token = bridge.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  let inFlight: Promise<string | null> | null = null;

  const resId = http.interceptors.response.use(
    (res) => res,
    async (error: unknown) => {
      const appError = toAppError(error);
      const config =
        axios.isAxiosError(error) ? (error.config as RetriableConfig | undefined) : undefined;

      // Only 401 triggers the refresh dance. Everything else translates and rejects.
      if (appError.kind !== 'unauthorized' || !config || config._retried) {
        return Promise.reject(appError);
      }
      config._retried = true;

      inFlight ??= bridge.refresh().finally(() => {
        inFlight = null;
      });

      const token = await inFlight;

      if (!token) {
        bridge.onAuthFailure();
        return Promise.reject(appError);
      }

      config.headers.Authorization = `Bearer ${token}`;
      // The retried request may itself fail — that rejection also flows through toAppError.
      try {
        return await http(config);
      } catch (retryError) {
        return Promise.reject(toAppError(retryError));
      }
    },
  );

  return () => {
    http.interceptors.request.eject(reqId);
    http.interceptors.response.eject(resId);
  };
}