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
  return getEnv('VITE_API_URL', 'http://localhost:3000');
};

export const getAppUrl = (): string => {
  return getEnv('VITE_APP_URL', window.location.origin);
};

export const envConfig = {
  apiUrl: getApiUrl(),
  appUrl: getAppUrl(),
  isDev: isDev(),
  isProd: isProd(),
  mode: env.MODE || 'development',
};
