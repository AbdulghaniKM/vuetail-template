import { AxiosError } from 'axios';

// A readable message from a failed request, e.g. for a query's `error`:
//   <p v-if="error">{{ extractApiErrorMessage(error) }}</p>
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
