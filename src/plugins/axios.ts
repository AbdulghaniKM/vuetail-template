import axios from 'axios';
import { getApiUrl } from '../config/env';
import { getAuthToken, clearAuthSession } from '../composables/useAuth';

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

// ── Request: attach auth token ──────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response: handle 401 ────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthSession();
      // Optionally redirect: window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
