import { ref, watch, type Ref } from 'vue';

/**
 * Returns a debounced ref that updates `delay` ms after the source stops changing.
 */
export function useDebounce<T>(source: Ref<T>, delay = 300): Readonly<Ref<T>> {
  const debounced = ref(source.value) as Ref<T>;
  let timer: ReturnType<typeof setTimeout> | null = null;

  watch(source, (val) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      debounced.value = val;
    }, delay);
  });

  return debounced;
}

/**
 * Returns a throttled ref that updates at most once every `interval` ms.
 */
export function useThrottle<T>(source: Ref<T>, interval = 300): Readonly<Ref<T>> {
  const throttled = ref(source.value) as Ref<T>;
  let lastUpdate = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  watch(source, (val) => {
    const now = Date.now();
    const remaining = interval - (now - lastUpdate);

    if (remaining <= 0) {
      throttled.value = val;
      lastUpdate = now;
    } else {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        throttled.value = val;
        lastUpdate = Date.now();
      }, remaining);
    }
  });

  return throttled;
}
