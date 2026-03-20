import { computed, ref, type Ref } from 'vue';

interface UsePaginationOptions {
  /** Total number of items */
  total: Ref<number> | number;
  /** Items per page */
  pageSize?: Ref<number> | number;
  /** Initial page (1-based) */
  initialPage?: number;
  /** Max visible page buttons */
  maxVisiblePages?: number;
}

export function usePagination(options: UsePaginationOptions) {
  const totalRef = computed(() =>
    typeof options.total === 'number' ? options.total : options.total.value,
  );
  const pageSizeRef = computed(() => {
    const ps = options.pageSize ?? 10;
    return typeof ps === 'number' ? ps : ps.value;
  });
  const maxVisible = options.maxVisiblePages ?? 5;

  const page = ref(options.initialPage ?? 1);

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalRef.value / pageSizeRef.value)),
  );

  const startIndex = computed(() => (page.value - 1) * pageSizeRef.value);
  const endIndex = computed(() =>
    Math.min(startIndex.value + pageSizeRef.value, totalRef.value),
  );

  const isFirst = computed(() => page.value <= 1);
  const isLast = computed(() => page.value >= totalPages.value);

  const range = computed(() => ({
    start: totalRef.value === 0 ? 0 : startIndex.value + 1,
    end: endIndex.value,
    total: totalRef.value,
  }));

  /** Visible page numbers for a pagination bar */
  const visiblePages = computed(() => {
    const pages: number[] = [];
    const total = totalPages.value;
    let start = Math.max(1, page.value - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  });

  const goTo = (p: number) => {
    page.value = Math.max(1, Math.min(p, totalPages.value));
  };

  const next = () => {
    if (!isLast.value) page.value++;
  };

  const prev = () => {
    if (!isFirst.value) page.value--;
  };

  const first = () => {
    page.value = 1;
  };

  const last = () => {
    page.value = totalPages.value;
  };

  /** Slice an array according to the current page */
  function paginate<T>(items: T[]): T[] {
    return items.slice(startIndex.value, endIndex.value);
  }

  return {
    page,
    pageSize: pageSizeRef,
    totalPages,
    startIndex,
    endIndex,
    isFirst,
    isLast,
    range,
    visiblePages,
    goTo,
    next,
    prev,
    first,
    last,
    paginate,
  };
}
