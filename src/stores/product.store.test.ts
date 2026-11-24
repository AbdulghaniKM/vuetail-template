import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useProductStore } from './product.store';

describe('product store', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('starts a new search on page 1', () => {
    const store = useProductStore();
    store.goToPage(4);
    store.search = 'lamp';
    expect(store.page).toBe(1);
    expect(store.params).toMatchObject({ page: 1, search: 'lamp' });
  });

  it('flips the direction when the same column is sorted again', () => {
    const store = useProductStore();
    store.sortOn('price');
    expect(store.sortDir).toBe('asc');
    store.sortOn('price');
    expect(store.sortDir).toBe('desc');
  });

  it('leaves an empty search out of the params, so it shares a cache key with no search', () => {
    const store = useProductStore();
    store.search = '   ';
    expect(store.params.search).toBeUndefined();
  });
});
