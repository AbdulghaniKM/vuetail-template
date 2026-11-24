// Client-only state for the products list: what the user searched, how they sorted, which page
// they were on. It lives in Pinia so it survives leaving the list and coming back. The products
// themselves stay in the query cache (src/queries/product.queries.ts), never in this store.
//
//   const productStore = useProductStore();
//   const { search } = storeToRefs(productStore);           // v-model="search"
//   const { data, isPlaceholderData } = useProducts(() => productStore.params);
export const useProductStore = defineStore('product', () => {
  const search = ref('');
  const page = ref(1);
  const perPage = ref(15);
  const sortBy = ref<keyof Product>('name');
  const sortDir = ref<'asc' | 'desc'>('asc');

  /** What useProducts takes. A change here refetches the list, or reads it from the cache. */
  const params = computed<QueryParams>(() => ({
    page: page.value,
    perPage: perPage.value,
    search: search.value.trim() || undefined,
    sortBy: sortBy.value,
    sortDir: sortDir.value,
  }));

  // A new search or sort starts again at page 1: page 4 of the old results means nothing now.
  // `sync` resets the page in the same tick, so the list never asks for page 4 of the new search.
  watch(
    [search, sortBy, sortDir],
    () => {
      page.value = 1;
    },
    { flush: 'sync' },
  );

  /** Sort on a column; the same column again flips the direction. */
  const sortOn = (column: keyof Product) => {
    if (sortBy.value === column) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortBy.value = column;
      sortDir.value = 'asc';
    }
  };

  const goToPage = (target: number) => {
    page.value = Math.max(1, target);
  };

  // Setup stores have no built-in $reset; this one puts every filter back.
  const $reset = () => {
    search.value = '';
    page.value = 1;
    perPage.value = 15;
    sortBy.value = 'name';
    sortDir.value = 'asc';
  };

  return { search, page, perPage, sortBy, sortDir, params, sortOn, goToPage, $reset };
});
