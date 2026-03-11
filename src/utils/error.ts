import { AxiosError } from 'axios';

export function extractApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data;

    if (data?.errors && typeof data.errors === 'object') {
      const messages = Object.values(data.errors as Record<string, string[]>).flat();
      if (messages.length) return messages.join('\n');
    }

    return data?.msg ?? data?.message ?? data?.title ?? 'An unexpected error occurred';
  }
  return (error as Error).message ?? 'An unexpected error occurred';
}

export async function withApiErrorHandler<T>(
  fn: () => Promise<T>,
  loadingRef?: { value: boolean }
): Promise<T> {
  try {
    if (loadingRef) loadingRef.value = true;
    return await fn();
  } catch (error) {
    throw new Error(extractApiErrorMessage(error));
  } finally {
    if (loadingRef) loadingRef.value = false;
  }
}
