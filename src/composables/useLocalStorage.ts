import { ref, watch, type Ref } from 'vue';
import type { ZodType } from 'zod';

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  schema?: ZodType<T>,
): Ref<T> {
  const read = (): T => {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;

      const parsed = JSON.parse(raw);

      if (schema) {
        const result = schema.safeParse(parsed);
        return result.success ? result.data : defaultValue;
      }

      return parsed as T;
    } catch {
      return defaultValue;
    }
  };

  const data = ref<T>(read()) as Ref<T>;

  watch(
    data,
    (value) => {
      try {
        if (value === null || value === undefined) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(value));
        }
      } catch {
        // Storage full or unavailable
      }
    },
    { deep: true },
  );

  return data;
}
