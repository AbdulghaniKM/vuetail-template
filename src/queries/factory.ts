import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import type { BaseApiService } from '@/services/BaseApiService';

/**
 * Cache keys, queries and mutations for one REST resource, built on its service.
 *
 * Keys nest, so one call can refresh a whole family:
 *   [name]                     everything for this resource
 *   [name, 'list']             every list (any page, filter or sort)
 *   [name, 'list', params]     one list
 *   [name, 'detail', id]       one item (ids are stored as strings, so 7 and '7' match)
 *
 * Mutations refresh the lists when they succeed and return that refresh, so `isPending` stays
 * true until the lists on screen are current.
 */
export function createResourceQueries<T, CreateDto = Partial<T>, UpdateDto = Partial<T>>(
  name: string,
  service: BaseApiService<T, CreateDto, UpdateDto>,
) {
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
    return useMutation({
      mutationFn: (draft: CreateDto) => service.create(draft),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.lists() }),
    });
  };

  const useUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, patch }: { id: Id; patch: UpdateDto }) => service.update(id, patch),
      onSuccess: (updated, { id }) => {
        queryClient.setQueryData(keys.detail(id), updated);
        return queryClient.invalidateQueries({ queryKey: keys.lists() });
      },
    });
  };

  const useRemove = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: Id) => service.remove(id),
      onSuccess: (_result, id) => {
        queryClient.removeQueries({ queryKey: keys.detail(id) });
        return queryClient.invalidateQueries({ queryKey: keys.lists() });
      },
    });
  };

  return { keys, useList, useOne, useCreate, useUpdate, useRemove };
}
