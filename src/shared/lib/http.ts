import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@shared/config/env';

export const http: AxiosInstance = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true, // send the HttpOnly refresh cookie
  timeout: 15_000,
});

/**
 * The seam. `shared` defines the hole; `features/auth` fills it.
 * Nothing here knows what a "user" or a "role" is.
 */
export interface AuthBridge {
  getAccessToken: () => string | null;
  /** Returns a fresh access token, or null if the session is dead. */
  refresh: () => Promise<string | null>;
  onAuthFailure: () => void;
}

/** Marks a request we've already retried, so we never loop. */
type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

export function installAuthInterceptors(bridge: AuthBridge): () => void {
  const reqId = http.interceptors.request.use((config) => {
    const token = bridge.getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Single-flight refresh: 10 concurrent 401s must trigger ONE refresh call.
  let inFlight: Promise<string | null> | null = null;

  const resId = http.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const config = error.config as RetriableConfig | undefined;

      if (error.response?.status !== 401 || !config || config._retried) {
        return Promise.reject(error);
      }
      config._retried = true;

      inFlight ??= bridge.refresh().finally(() => {
        inFlight = null;
      });

      const token = await inFlight;

      if (!token) {
        bridge.onAuthFailure();
        return Promise.reject(error);
      }

      config.headers.Authorization = `Bearer ${token}`;
      return http(config);
    },
  );

  return () => {
    http.interceptors.request.eject(reqId);
    http.interceptors.response.eject(resId);
  };
}