import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { getApiUrl } from '@/config/env';

export interface AuthProvider {
  getToken?: () => string | null | undefined;
  refreshToken?: () => Promise<string | null>;
  onUnauthorized?: () => void;
}

type AuthStore = {
  provider: AuthProvider;
  refreshPromise: Promise<string | null> | null;
};

const g = globalThis as typeof globalThis & { __vuetailAuth?: AuthStore };
const store: AuthStore =
  g.__vuetailAuth ?? (g.__vuetailAuth = { provider: {}, refreshPromise: null });

export const setAuthProvider = (provider: AuthProvider): void => {
  store.refreshPromise = null;
  store.provider = { ...store.provider, ...provider };
};

const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.provider.getToken?.();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

type RetryableRequest = AxiosRequestConfig & { _retry?: boolean };

const performRefresh = (): Promise<string | null> => {
  if (store.refreshPromise) return store.refreshPromise;
  const refresh = store.provider.refreshToken;
  if (!refresh) return Promise.resolve(null);
  store.refreshPromise = refresh().finally(() => {
    store.refreshPromise = null;
  });
  return store.refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (!store.provider.refreshToken) {
      store.provider.onUnauthorized?.();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newToken = await performRefresh();
      if (!newToken) {
        store.provider.onUnauthorized?.();
        return Promise.reject(error);
      }
      if (originalRequest.headers) {
        (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
      }
      return api(originalRequest);
    } catch (refreshError) {
      store.provider.onUnauthorized?.();
      return Promise.reject(refreshError);
    }
  },
);

export default api;

export const apiGet = <T>(url: string, config?: AxiosRequestConfig) =>
  api.get<T>(url, config).then((response) => response.data);

export const apiPost = <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
  api.post<T>(url, body, config).then((response) => response.data);

export const apiPut = <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
  api.put<T>(url, body, config).then((response) => response.data);

export const apiPatch = <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
  api.patch<T>(url, body, config).then((response) => response.data);

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig) =>
  api.delete<T>(url, config).then((response) => response.data);

export interface ErrorToastOptions {
  onError: (message: string, opts?: { title?: string }) => void;
  messages?: {
    forbidden?: string;
    serverError?: string;
    network?: string;
  };
}

let errorInterceptorId: number | null = null;

export const registerErrorToasts = (options: ErrorToastOptions): void => {
  if (errorInterceptorId !== null) api.interceptors.response.eject(errorInterceptorId);
  const msgs = {
    forbidden: "You don't have permission to do that.",
    serverError: 'Something went wrong on our end. Please try again.',
    network: 'Network error — check your connection.',
    ...options.messages,
  };

  errorInterceptorId = api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status;
      if (!error.response) {
        options.onError(msgs.network);
      } else if (status === 403) {
        options.onError(msgs.forbidden);
      } else if (status && status >= 500) {
        options.onError(msgs.serverError);
      }
      // 401 is handled by the refresh interceptor — don't toast it.
      return Promise.reject(error);
    },
  );
};

export const unregisterErrorToasts = (): void => {
  if (errorInterceptorId !== null) {
    api.interceptors.response.eject(errorInterceptorId);
    errorInterceptorId = null;
  }
};
