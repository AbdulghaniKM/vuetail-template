import {
  hashKey,
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationReturnType,
} from '@tanstack/vue-query';
import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import type { BaseApiService } from '@/services/BaseApiService';

/** Plain JSON-like data: two values of it with the same hash really are the same request. */
const isPlainData = (value: unknown): boolean => {
  if (value === null || typeof value !== 'object') return typeof value !== 'function';
  if (Array.isArray(value)) return value.every(isPlainData);
  const proto = Object.getPrototypeOf(value);
  return (proto === Object.prototype || proto === null) && Object.values(value).every(isPlainData);
};

/**
 * Drops a mutation call that repeats one still in flight: same action, same variables. A
 * double-clicked Save sends one request; saving two different rows still sends two.
 * `mutateAsync` on a repeat returns the in-flight call's promise; `mutate` ignores it.
 *
 * Only plain data is compared. A File, FormData or Date hashes as `{}`, so calls carrying one
 * always go through rather than risk dropping a different upload.
 */
function dedupeInFlight<TData, TVariables>(
  action: string,
  inFlight: Map<string, Promise<unknown>>,
  mutation: UseMutationReturnType<TData, Error, TVariables, unknown>,
) {
  type Args = Parameters<typeof mutation.mutateAsync>;

  const mutateAsync = (...args: Args): Promise<TData> => {
    const [variables] = args;
    if (!isPlainData(variables)) return mutation.mutateAsync(...args);
    const key = hashKey([action, variables]);
    const pending = inFlight.get(key) as Promise<TData> | undefined;
    if (pending) return pending;
    const call = mutation.mutateAsync(...args).finally(() => inFlight.delete(key));
    inFlight.set(key, call);
    return call;
  };
  // As with TanStack's own `mutate`, a failure lands in `error` and onError, not as a rejection.
  const mutate = (...args: Args): void => {
    mutateAsync(...args).catch(() => {});
  };
  return {
    ...mutation,
    mutate: mutate as typeof mutation.mutate,
    mutateAsync: mutateAsync as typeof mutation.mutateAsync,
  };
}

/**
 * Cache keys, queries and mutations for one REST resource, built on its service.
 *
 * Keys nest, so one call can refresh a whole family:
 *   [name]                     everything for this resource
 *   [name, 'list']             every list (any page, filter or sort)
 *   [name, 'list', params]     one list
 *   [name, 'detail', id]       one item (ids are stored as strings, so 7 and '7' match)
 *
 * No duplicate requests:
 *   - Reads: every component asking for the same key shares one request and one cache entry.
 *     Keys hash by value, so `{ page: 1, search: undefined }` and `{ page: 1 }` are the same list.
 *   - Writes: a create, update or remove that repeats one still in flight is dropped
 *     (see dedupeInFlight), across every component using this resource.
 *
 * Mutations refresh the lists when they succeed and return that refresh, so `isPending` stays
 * true until the lists on screen are current.
 */
export function createResourceQueries<T, CreateDto = Partial<T>, UpdateDto = Partial<T>>(
  name: string,
  service: BaseApiService<T, CreateDto, UpdateDto>,
) {
  // Shared by every component that uses this resource, so two forms can't double-submit either.
  const inFlight = new Map<string, Promise<unknown>>();

  const keys = {
    all: [name] as const,
    lists: () => [name, 'list'] as const,
    list: (params: QueryParams) => [name, 'list', params] as const,
    details: () => [name, 'detail'] as const,
    detail: (id: Id) => [name, 'detail', String(id)] as const,
  };

  /** One page of the collection. Keeps the previous page on screen while the next one loads. */
  const useList = (params: MaybeRefOrGetter<QueryParams> = {}) =>
    useQuery({
      queryKey: computed(() => keys.list(toValue(params))),
      queryFn: ({ signal }) => service.findAll(toValue(params), { signal }),
      placeholderData: keepPreviousData,
    });

  /** One item. Waits while `id` is null or undefined, e.g. a route param that is not there yet. */
  const useOne = (id: MaybeRefOrGetter<Id | null | undefined>) =>
    useQuery({
      queryKey: computed(() => keys.detail(toValue(id) ?? '')),
      queryFn: ({ signal }) => service.findOne(toValue(id) as Id, { signal }),
      enabled: computed(() => toValue(id) != null),
    });

  const useCreate = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationKey: [name, 'create'],
      mutationFn: (draft: CreateDto) => service.create(draft),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.lists() }),
    });
    return dedupeInFlight('create', inFlight, mutation);
  };

  const useUpdate = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationKey: [name, 'update'],
      mutationFn: ({ id, patch }: { id: Id; patch: UpdateDto }) => service.update(id, patch),
      onSuccess: (updated, { id }) => {
        queryClient.setQueryData(keys.detail(id), updated);
        return queryClient.invalidateQueries({ queryKey: keys.lists() });
      },
    });
    return dedupeInFlight('update', inFlight, mutation);
  };

  const useRemove = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
      mutationKey: [name, 'remove'],
      mutationFn: (id: Id) => service.remove(id),
      onSuccess: (_result, id) => {
        queryClient.removeQueries({ queryKey: keys.detail(id) });
        return queryClient.invalidateQueries({ queryKey: keys.lists() });
      },
    });
    return dedupeInFlight('remove', inFlight, mutation);
  };

  return { keys, useList, useOne, useCreate, useUpdate, useRemove };
}
