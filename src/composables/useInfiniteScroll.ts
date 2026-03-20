import { ref, onUnmounted, type Ref } from 'vue';

interface UseInfiniteScrollOptions<T> {
  /** Fetch function — receives the page number (1-based), returns an array of items */
  fetch: (page: number) => Promise<T[]>;
  /** Number of items per page (used to detect "no more data") */
  pageSize?: number;
  /** Pixel threshold before the bottom to trigger the next fetch */
  threshold?: number;
}

export function useInfiniteScroll<T>(options: UseInfiniteScrollOptions<T>) {
  const { fetch, pageSize = 20, threshold = 200 } = options;

  const items: Ref<T[]> = ref([]) as Ref<T[]>;
  const loading = ref(false);
  const done = ref(false);
  const error = ref<string | null>(null);
  const containerRef = ref<HTMLElement | null>(null);

  let currentPage = 0;
  let observer: IntersectionObserver | null = null;
  let sentinel: HTMLElement | null = null;

  const loadMore = async () => {
    if (loading.value || done.value) return;

    loading.value = true;
    error.value = null;

    try {
      currentPage++;
      const result = await fetch(currentPage);
      items.value = [...items.value, ...result] as T[];

      if (result.length < pageSize) {
        done.value = true;
      }
    } catch (e: any) {
      error.value = e?.message || 'Failed to load more items';
      currentPage--;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    items.value = [];
    currentPage = 0;
    done.value = false;
    error.value = null;
    loadMore();
  };

  const observe = (el: HTMLElement) => {
    if (observer) observer.disconnect();

    sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    el.appendChild(sentinel);

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { root: el, rootMargin: `0px 0px ${threshold}px 0px` },
    );

    observer.observe(sentinel);
  };

  // Auto-observe when containerRef is set
  const stopWatch = ref(false);
  const checkContainer = () => {
    if (containerRef.value && !stopWatch.value) {
      observe(containerRef.value);
      loadMore();
      stopWatch.value = true;
    }
  };

  // Poll once on next tick (composable can't use watch on template ref reliably)
  const interval = setInterval(checkContainer, 100);
  setTimeout(() => clearInterval(interval), 5000);

  onUnmounted(() => {
    clearInterval(interval);
    if (observer) observer.disconnect();
    if (sentinel) sentinel.remove();
  });

  return { items, loading, done, error, containerRef, reset, loadMore };
}
