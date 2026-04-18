interface EnvConfig {
  [key: string]: string | undefined;
}

const env: EnvConfig = import.meta.env;

export const getEnv = (key: string, defaultValue?: string): string => {
  return env[key] ?? defaultValue ?? '';
};

export const getEnvNumber = (key: string, defaultValue?: number): number => {
  const value = env[key];
  if (!value) return defaultValue ?? 0;
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue ?? 0 : parsed;
};

export const getEnvBoolean = (key: string, defaultValue?: boolean): boolean => {
  const value = env[key];
  if (!value) return defaultValue ?? false;
  return value === 'true' || value === '1';
};

export const isDev = (): boolean => {
  return env.MODE === 'development' || env.DEV === 'true';
};

export const isProd = (): boolean => {
  return env.MODE === 'production' || env.PROD === 'true';
};

export const getApiUrl = (): string => {
  const url = getEnv('VITE_API_URL');
  if (!url && isProd()) {
    console.error('[env] VITE_API_URL is not set — API calls will fail in production.');
  }
  return url || '/api';
};

export const getAppUrl = (): string => {
  const fallback = typeof window !== 'undefined' ? window.location.origin : '';
  return getEnv('VITE_APP_URL', fallback);
};

export const envConfig = {
  get apiUrl() {
    return getApiUrl();
  },
  get appUrl() {
    return getAppUrl();
  },
  get isDev() {
    return isDev();
  },
  get isProd() {
    return isProd();
  },
  mode: env.MODE || 'development',
};
