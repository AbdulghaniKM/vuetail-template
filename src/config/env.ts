import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z
    .string()
    .default('/api')
    .refine(
      (url) => {
        // Relative paths (e.g. "/api") are always allowed. Absolute URLs must be
        // HTTPS in production: the bearer token rides in the Authorization header
        // and would otherwise be exposed to MITM over plain HTTP.
        if (!/^https?:\/\//i.test(url)) return true;
        if (!import.meta.env.PROD) return true;
        return url.startsWith('https://');
      },
      { message: 'VITE_API_URL must use https:// in production.' },
    ),
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

export const isDev = (): boolean =>
  env.MODE === 'development' || env.DEV === true || env.DEV === 'true';
export const isProd = (): boolean =>
  env.MODE === 'production' || env.PROD === true || env.PROD === 'true';

export const getApiUrl = (): string => env.VITE_API_URL ?? '/api';
export const getAppUrl = (): string => {
  if (env.VITE_APP_URL) return env.VITE_APP_URL;
  return typeof window !== 'undefined' ? window.location.origin : '';
};
