import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { getApiUrl } from '../config/env';

export interface AuthProvider {
  getToken?: () => string | null | undefined;
  refreshToken?: () => Promise<string | null>;
  onUnauthorized?: () => void;
}

let authProvider: AuthProvider = {};

export const setAuthProvider = (provider: AuthProvider): void => {
  authProvider = { ...authProvider, ...provider };
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
    const token = authProvider.getToken?.();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

type RetryableRequest = AxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string | null> | null = null;

const performRefresh = (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;
  const refresh = authProvider.refreshToken;
  if (!refresh) return Promise.resolve(null);
  refreshPromise = refresh().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (!authProvider.refreshToken) {
      authProvider.onUnauthorized?.();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newToken = await performRefresh();
      if (!newToken) {
        authProvider.onUnauthorized?.();
        return Promise.reject(error);
      }
      if (originalRequest.headers) {
        (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
      }
      return api(originalRequest);
    } catch (refreshError) {
      authProvider.onUnauthorized?.();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
