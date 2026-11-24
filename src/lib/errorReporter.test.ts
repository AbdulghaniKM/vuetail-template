import { AxiosError, CanceledError, type InternalAxiosRequestConfig } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createQueryClient } from '@/queries/client';
import { reportError, setErrorReporter } from './errorReporter';

const httpError = (status?: number) => {
  const config = { headers: {} } as InternalAxiosRequestConfig;
  const response =
    status === undefined ? undefined : { status, statusText: '', headers: {}, config, data: {} };
  return new AxiosError('failed', 'ERR', config, null, response);
};

describe('reportError', () => {
  afterEach(() => setErrorReporter());

  it('reports bugs and server errors', () => {
    const reporter = vi.fn();
    setErrorReporter(reporter);
    reportError(new TypeError('x is undefined'), { source: 'vue' });
    reportError(httpError(503), { source: 'query' });
    expect(reporter).toHaveBeenCalledTimes(2);
  });

  it('skips 4xx answers, cancelled requests and being offline', () => {
    const reporter = vi.fn();
    setErrorReporter(reporter);
    reportError(httpError(404), { source: 'query' });
    reportError(httpError(422), { source: 'mutation' });
    reportError(httpError(), { source: 'query' });
    reportError(new CanceledError(), { source: 'query' });
    expect(reporter).not.toHaveBeenCalled();
  });

  it('survives a reporter that throws', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    setErrorReporter(() => {
      throw new Error('tracker down');
    });
    expect(() => reportError(new Error('bug'), { source: 'vue' })).not.toThrow();
    expect(consoleError).toHaveBeenCalled();
  });

  it('receives failed queries from the query client, with their key', async () => {
    const reporter = vi.fn();
    setErrorReporter(reporter);
    const queryClient = createQueryClient();
    await queryClient
      .fetchQuery({
        queryKey: ['todos', 'list'],
        queryFn: () => Promise.reject(new Error('bad select')),
      })
      .catch(() => {});
    expect(reporter).toHaveBeenCalledWith(expect.any(Error), {
      source: 'query',
      key: ['todos', 'list'],
    });
  });
});
