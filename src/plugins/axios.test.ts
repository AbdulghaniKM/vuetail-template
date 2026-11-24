import { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, setAuthProvider } from './axios';

/** Answers 401 to any request without the fresh token, and 200 to any request with it. */
const adapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
  const response = { data: { url: config.url }, headers: {}, config, statusText: '' };
  if (config.headers.Authorization === 'Bearer fresh') return { ...response, status: 200 };
  throw new AxiosError('Unauthorized', '401', config, null, { ...response, status: 401 });
};

describe('axios auth refresh', () => {
  const originalAdapter = api.defaults.adapter;
  afterEach(() => {
    api.defaults.adapter = originalAdapter;
    setAuthProvider({ getToken: () => null, refreshToken: undefined, onUnauthorized: undefined });
  });

  it('refreshes once for many requests that fail with 401 at the same time', async () => {
    api.defaults.adapter = adapter;
    const refreshToken = vi.fn(async () => 'fresh');
    setAuthProvider({ getToken: () => 'expired', refreshToken });

    const results = await Promise.all(['/a', '/b', '/c'].map((url) => api.get(url)));

    expect(refreshToken).toHaveBeenCalledTimes(1);
    expect(results.map((r) => r.status)).toEqual([200, 200, 200]);
  });

  it('gives up after one retry instead of looping on 401', async () => {
    api.defaults.adapter = adapter;
    const refreshToken = vi.fn(async () => 'still-bad');
    const onUnauthorized = vi.fn();
    setAuthProvider({ getToken: () => 'expired', refreshToken, onUnauthorized });

    await expect(api.get('/a')).rejects.toBeInstanceOf(AxiosError);
    expect(refreshToken).toHaveBeenCalledTimes(1);
  });
});
