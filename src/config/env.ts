import { z } from 'zod';
const envSchema = z.object({
  VITE_API_URL: z.string().default('/api'),
  VITE_APP_URL: z.string().optional(),
  MODE: z.string().default('development'),
  DEV: z.union([z.boolean(), z.string()]).optional(),
  PROD: z.union([z.boolean(), z.string()]).optional(),
});
type AppEnv = z.infer<typeof envSchema>;
const parsed = envSchema.safeParse(import.meta.env);
if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  ${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('\n');
  throw new Error(`[env] Invalid environment:\n${issues}`);
}
export const env: AppEnv = parsed.data;
export const getEnv = (key: keyof AppEnv, defaultValue?: string): string => {
  const v = env[key];
  if (typeof v === 'string') return v;
  return defaultValue ?? '';
};
export const getEnvNumber = (key: keyof AppEnv, defaultValue?: number): number => {
  const v = env[key];
  if (typeof v !== 'string') return defaultValue ?? 0;
  const parsedNum = Number(v);
  return Number.isNaN(parsedNum) ? (defaultValue ?? 0) : parsedNum;
};
export const getEnvBoolean = (key: keyof AppEnv, defaultValue?: boolean): boolean => {
  const v = env[key];
  if (typeof v === 'boolean') return v;
  if (typeof v !== 'string') return defaultValue ?? false;
  return v === 'true' || v === '1';
};
export const isDev = (): boolean =>
  env.MODE === 'development' || env.DEV === true || env.DEV === 'true';
export const isProd = (): boolean =>
  env.MODE === 'production' || env.PROD === true || env.PROD === 'true';
export const getApiUrl = (): string => env.VITE_API_URL ?? '/api';
export const getAppUrl = (): string => {
  if (env.VITE_APP_URL) return env.VITE_APP_URL;
  return typeof window !== 'undefined' ? window.location.origin : '';
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
  mode: env.MODE,
};
