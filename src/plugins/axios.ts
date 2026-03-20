import axios from 'axios';
import { getApiUrl } from '../config/env';

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
  (config) => {
    // Attach auth token if present (uncomment and adapt to your auth store)
    // import { useAuthStore } from '../stores/auth';
    // const authStore = useAuthStore();
    // if (authStore.token) {
    //   config.headers.Authorization = `Bearer ${authStore.token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Token expired / unauthorized — redirect to login or refresh token
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
