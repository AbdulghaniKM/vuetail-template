import { VueQueryPlugin } from '@tanstack/vue-query';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { productService } from '@/services/product.service';
import { createQueryClient } from './client';
import { productKeys, useToggleFavorite } from './product.queries';

const lamp: Product = { id: 1, name: 'Lamp', price: 10, description: '', favorite: false };
const desk: Product = { id: 2, name: 'Desk', price: 90, description: '', favorite: false };
const listParams = { page: 1 };

/** A promise the test settles by hand, to look at the screen while a request is in flight. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/** A cache already holding a list and one detail, and a mounted useToggleFavorite. */
function setup() {
  const queryClient = createQueryClient();
  queryClient.setQueryData(productKeys.list(listParams), {
    data: [lamp, desk],
    meta: { page: 1, perPage: 15, total: 2, lastPage: 1 },
  });
  queryClient.setQueryData(productKeys.detail(1), lamp);

  let toggle!: ReturnType<typeof useToggleFavorite>;
  mount(
    defineComponent({
      setup() {
        toggle = useToggleFavorite();
        return () => null;
      },
    }),
    { global: { plugins: [[VueQueryPlugin, { queryClient }]] } },
  );

  const favoriteOf = (id: number) => ({
    inList: queryClient
      .getQueryData<PaginatedResponse<Product>>(productKeys.list(listParams))
      ?.data.find((p) => p.id === id)?.favorite,
    inDetail: queryClient.getQueryData<Product>(productKeys.detail(id))?.favorite,
  });

  return { queryClient, toggle, favoriteOf };
}

describe('useToggleFavorite (optimistic)', () => {
  it('shows the star before the server answers, in the list and the detail', async () => {
    const request = deferred<Product>();
    vi.spyOn(productService, 'update').mockReturnValue(request.promise);
    const { toggle, favoriteOf } = setup();

    toggle.mutate({ id: 1, favorite: true });
    await flushPromises();

    expect(favoriteOf(1)).toEqual({ inList: true, inDetail: true });
    expect(favoriteOf(2).inList).toBe(false); // only that product
    request.resolve({ ...lamp, favorite: true });
  });

  it('takes the star back when the server refuses', async () => {
    const request = deferred<Product>();
    vi.spyOn(productService, 'update').mockReturnValue(request.promise);
    vi.spyOn(console, 'error').mockImplementation(() => {}); // the reporter logs the failure
    const { toggle, favoriteOf } = setup();

    toggle.mutate({ id: 1, favorite: true });
    await flushPromises();
    request.reject(new Error('refused'));
    await flushPromises();

    expect(favoriteOf(1)).toEqual({ inList: false, inDetail: false });
    expect(toggle.error.value?.message).toBe('refused');
  });

  it('keeps another product’s star when one toggle fails', async () => {
    const lampRequest = deferred<Product>();
    const deskRequest = deferred<Product>();
    vi.spyOn(productService, 'update')
      .mockReturnValueOnce(lampRequest.promise)
      .mockReturnValueOnce(deskRequest.promise);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { toggle, favoriteOf } = setup();

    toggle.mutate({ id: 1, favorite: true });
    toggle.mutate({ id: 2, favorite: true });
    await flushPromises();
    lampRequest.reject(new Error('refused'));
    await flushPromises();

    expect(favoriteOf(1).inList).toBe(false);
    expect(favoriteOf(2).inList).toBe(true);
    deskRequest.resolve({ ...desk, favorite: true });
  });

  it('refetches once, after the last of several quick toggles', async () => {
    const lampRequest = deferred<Product>();
    const deskRequest = deferred<Product>();
    vi.spyOn(productService, 'update')
      .mockReturnValueOnce(lampRequest.promise)
      .mockReturnValueOnce(deskRequest.promise);
    const { queryClient, toggle } = setup();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');

    toggle.mutate({ id: 1, favorite: true });
    toggle.mutate({ id: 2, favorite: true });
    await flushPromises();

    lampRequest.resolve({ ...lamp, favorite: true });
    await flushPromises();
    expect(invalidate).not.toHaveBeenCalled(); // desk is still in flight

    deskRequest.resolve({ ...desk, favorite: true });
    await flushPromises();
    expect(invalidate).toHaveBeenCalledTimes(1);
  });
});
