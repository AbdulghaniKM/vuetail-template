import { VueQueryPlugin } from '@tanstack/vue-query';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import type { BaseApiService } from '@/services/BaseApiService';
import { createQueryClient } from './client';
import { createResourceQueries } from './factory';

interface Todo {
  id: number;
  title: string;
}

const page = (data: Todo[]) => ({
  data,
  meta: { page: 1, perPage: 15, total: data.length, lastPage: 1 },
});

/** A service whose methods are spies, and a fresh resource + cache per test. */
function setup() {
  const service = {
    findAll: vi.fn(async () => page([{ id: 1, title: 'a' }])),
    findOne: vi.fn(async (id: number | string) => ({ id: Number(id), title: 'a' })),
    create: vi.fn(async (draft: Partial<Todo>) => ({ id: 2, title: 'b', ...draft })),
    update: vi.fn(async (id: number | string, patch: Partial<Todo>) => ({
      id: Number(id),
      title: 'a',
      ...patch,
    })),
    remove: vi.fn(async () => undefined),
  };
  const todos = createResourceQueries('todos', service as unknown as BaseApiService<Todo>);
  const queryClient = createQueryClient(); // the app's own defaults

  /** Mounts components that each run `use`, all sharing one cache. Returns what each returned. */
  function mountAll<R>(count: number, use: () => R): R[] {
    const results: R[] = [];
    const Child = defineComponent({
      setup() {
        results.push(use());
        return () => null;
      },
    });
    mount(
      defineComponent({
        render: () => Array.from({ length: count }, () => h(Child)),
      }),
      { global: { plugins: [[VueQueryPlugin, { queryClient }]] } },
    );
    return results;
  }

  return { service, todos, queryClient, mountAll };
}

describe('createResourceQueries: reads', () => {
  it('shares one request between components asking for the same list', async () => {
    const { service, todos, mountAll } = setup();
    mountAll(3, () => todos.useList({ page: 1 }));
    await flushPromises();
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('treats params equal by value as the same list (order, undefined)', async () => {
    const { service, todos, mountAll } = setup();
    mountAll(1, () => todos.useList({ page: 1, search: undefined, sortBy: 'title' }));
    mountAll(1, () => todos.useList({ sortBy: 'title', page: 1 }));
    await flushPromises();
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it('fetches each different list once', async () => {
    const { service, todos, mountAll } = setup();
    mountAll(2, () => todos.useList({ page: 1 }));
    mountAll(2, () => todos.useList({ page: 2 }));
    await flushPromises();
    expect(service.findAll).toHaveBeenCalledTimes(2);
  });

  it('shares one request for an item asked for as 7 and "7"', async () => {
    const { service, todos, mountAll } = setup();
    mountAll(1, () => todos.useOne(7));
    mountAll(1, () => todos.useOne('7'));
    await flushPromises();
    expect(service.findOne).toHaveBeenCalledTimes(1);
  });

  it('waits while the id is missing', async () => {
    const { service, todos, mountAll } = setup();
    mountAll(1, () => todos.useOne(null));
    await flushPromises();
    expect(service.findOne).not.toHaveBeenCalled();
  });

  it('serves fresh data from the cache when a component mounts later', async () => {
    const { service, todos, mountAll } = setup();
    mountAll(1, () => todos.useList({ page: 1 }));
    await flushPromises();
    mountAll(1, () => todos.useList({ page: 1 }));
    await flushPromises();
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });
});

describe('createResourceQueries: writes', () => {
  it('drops a repeated create while the first is in flight', async () => {
    const { service, todos, mountAll } = setup();
    const [create] = mountAll(1, () => todos.useCreate());
    create!.mutate({ title: 'b' });
    create!.mutate({ title: 'b' });
    await flushPromises();
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it('drops a repeat sent from another component too', async () => {
    const { service, todos, mountAll } = setup();
    const [first, second] = mountAll(2, () => todos.useCreate());
    first!.mutate({ title: 'b' });
    second!.mutate({ title: 'b' });
    await flushPromises();
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it('gives a repeated mutateAsync the first call’s result', async () => {
    const { service, todos, mountAll } = setup();
    const [create] = mountAll(1, () => todos.useCreate());
    const [a, b] = await Promise.all([
      create!.mutateAsync({ title: 'b' }),
      create!.mutateAsync({ title: 'b' }),
    ]);
    expect(service.create).toHaveBeenCalledTimes(1);
    expect(b).toBe(a);
  });

  it('sends different writes, and the same write again once the first settled', async () => {
    const { service, todos, mountAll } = setup();
    const [update] = mountAll(1, () => todos.useUpdate());
    update!.mutate({ id: 1, patch: { title: 'x' } });
    update!.mutate({ id: 2, patch: { title: 'x' } });
    await flushPromises();
    update!.mutate({ id: 1, patch: { title: 'x' } });
    await flushPromises();
    expect(service.update).toHaveBeenCalledTimes(3);
  });

  it('never drops a write carrying a File', async () => {
    const { service, todos, mountAll } = setup();
    const [create] = mountAll(1, () => todos.useCreate());
    create!.mutate({ title: new File(['1'], 'a.txt') } as unknown as Partial<Todo>);
    create!.mutate({ title: new File(['2'], 'b.txt') } as unknown as Partial<Todo>);
    await flushPromises();
    expect(service.create).toHaveBeenCalledTimes(2);
  });

  it('refetches the list on screen once after a create, and keeps a failure in `error`', async () => {
    const { service, todos, mountAll } = setup();
    const [[, create]] = mountAll(
      1,
      () => [todos.useList({ page: 1 }), todos.useCreate()] as const,
    );
    await flushPromises();
    expect(service.findAll).toHaveBeenCalledTimes(1);

    create.mutate({ title: 'b' });
    await flushPromises();
    expect(service.findAll).toHaveBeenCalledTimes(2);

    service.create.mockRejectedValueOnce(new Error('nope'));
    create.mutate({ title: 'c' });
    await flushPromises();
    expect(create.error.value?.message).toBe('nope');
  });

  it('writes an update into the item cache instead of refetching it', async () => {
    const { service, todos, queryClient, mountAll } = setup();
    const [update] = mountAll(1, () => todos.useUpdate());
    await update!.mutateAsync({ id: 1, patch: { title: 'new' } });
    expect(queryClient.getQueryData(todos.keys.detail(1))).toEqual({ id: 1, title: 'new' });
    expect(service.findOne).not.toHaveBeenCalled();
  });
});
