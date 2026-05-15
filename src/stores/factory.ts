import { defineStore } from 'pinia';
import { computed, ref, type ComputedRef, type Ref } from 'vue';
import type { PaginationMeta, QueryParams, PaginatedResponse } from '@/types/resource.types';

const STALE_AFTER_MINUTES = 5;

function emptyPaginationMeta(): PaginationMeta {
  return {
    page: 1,
    perPage: 15,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };
}

function hasExceededStaleThreshold(lastCompletedFetch: Date | null, staleAfterMinutes: number): boolean {
  if (!lastCompletedFetch) return true;
  return Date.now() - lastCompletedFetch.getTime() > staleAfterMinutes * 60_000;
}

function entityIdsMatch(storedIdentifier: unknown, requestedIdentifier: string | number): boolean {
  if (storedIdentifier === undefined || storedIdentifier === null) return false;
  return String(storedIdentifier) === String(requestedIdentifier);
}

function readEntityIdentifier(entity: object): unknown {
  return (entity as { id?: unknown }).id;
}

export interface ResourceCollectionClient<T> {
  findAll: (params?: QueryParams) => Promise<PaginatedResponse<T>>;
  findOne: (id: string | number) => Promise<T>;
  create: (draft: Partial<T>) => Promise<T>;
  update: (id: string | number, patch: Partial<T>) => Promise<T>;
  remove: (id: string | number) => Promise<void>;
}

export interface ResourceStoreBindings<T> {
  items: Ref<T[]>;
  selected: Ref<T | null>;
  isLoading: Ref<boolean>;
  isSaving: Ref<boolean>;
  error: Ref<string | null>;
  pagination: Ref<PaginationMeta>;
  queryParams: Ref<QueryParams>;
  lastFetched: Ref<Date | null>;
  isEmpty: ComputedRef<boolean>;
  isStale: ComputedRef<boolean>;
  fetchAll: (params?: QueryParams) => Promise<void>;
  fetchOne: (id: string | number) => Promise<void>;
  create: (draft: Partial<T>) => Promise<T>;
  update: (id: string | number, patch: Partial<T>) => Promise<T>;
  remove: (id: string | number) => Promise<void>;
  setQuery: (patch: Partial<QueryParams>) => void;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  findById: (id: string | number) => T | undefined;
  $reset: () => void;
}

export function createResourceStore<T extends object>(
  storeName: string,
  remoteCollection: ResourceCollectionClient<T>,
  extend?: (bindings: ResourceStoreBindings<T>) => Record<string, unknown>,
) {
  return defineStore(storeName, () => {
    const items = ref([] as T[]) as Ref<T[]>;
    const selected: Ref<T | null> = ref(null);
    const isLoading = ref(false);
    const isSaving = ref(false);
    const error = ref<string | null>(null);
    const pagination = ref<PaginationMeta>(emptyPaginationMeta());
    const queryParams = ref<QueryParams>({ page: 1, perPage: 15 });
    const lastFetched = ref<Date | null>(null);

    const isEmpty = computed(() => items.value.length === 0);
    const isStale = computed(() =>
      hasExceededStaleThreshold(lastFetched.value, STALE_AFTER_MINUTES),
    );

    async function fetchAll(params?: QueryParams) {
      isLoading.value = true;
      error.value = null;
      try {
        const mergedQueryParams = { ...queryParams.value, ...params };
        queryParams.value = mergedQueryParams;
        const collectionPage = await remoteCollection.findAll(mergedQueryParams);
        items.value = collectionPage.data;
        pagination.value = collectionPage.meta;
        lastFetched.value = new Date();
      } catch (failure: unknown) {
        error.value = failure instanceof Error ? failure.message : 'Failed to fetch';
        throw failure;
      } finally {
        isLoading.value = false;
      }
    }

    async function fetchOne(id: string | number) {
      isLoading.value = true;
      error.value = null;
      try {
        const loadedEntity = await remoteCollection.findOne(id);
        selected.value = loadedEntity;
        const matchingIndex = items.value.findIndex((item) =>
          entityIdsMatch(readEntityIdentifier(item), id),
        );
        if (matchingIndex >= 0) items.value[matchingIndex] = loadedEntity;
      } catch (failure: unknown) {
        error.value = failure instanceof Error ? failure.message : 'Failed to load';
        throw failure;
      } finally {
        isLoading.value = false;
      }
    }

    async function create(draft: Partial<T>) {
      isSaving.value = true;
      error.value = null;
      try {
        const createdEntity = await remoteCollection.create(draft);
        items.value = [createdEntity, ...items.value];
        selected.value = createdEntity;
        return createdEntity;
      } catch (failure: unknown) {
        error.value = failure instanceof Error ? failure.message : 'Failed to create';
        throw failure;
      } finally {
        isSaving.value = false;
      }
    }

    async function update(id: string | number, patch: Partial<T>) {
      isSaving.value = true;
      error.value = null;
      try {
        const updatedEntity = await remoteCollection.update(id, patch);
        const matchingIndex = items.value.findIndex((item) =>
          entityIdsMatch(readEntityIdentifier(item), id),
        );
        if (matchingIndex >= 0) items.value[matchingIndex] = updatedEntity;
        if (
          selected.value &&
          entityIdsMatch(readEntityIdentifier(selected.value), id)
        ) {
          selected.value = updatedEntity;
        }
        return updatedEntity;
      } catch (failure: unknown) {
        error.value = failure instanceof Error ? failure.message : 'Failed to update';
        throw failure;
      } finally {
        isSaving.value = false;
      }
    }

    async function remove(id: string | number) {
      isSaving.value = true;
      error.value = null;
      try {
        await remoteCollection.remove(id);
        items.value = items.value.filter(
          (item) => !entityIdsMatch(readEntityIdentifier(item), id),
        );
        if (
          selected.value &&
          entityIdsMatch(readEntityIdentifier(selected.value), id)
        ) {
          selected.value = null;
        }
      } catch (failure: unknown) {
        error.value = failure instanceof Error ? failure.message : 'Failed to delete';
        throw failure;
      } finally {
        isSaving.value = false;
      }
    }

    function setQuery(patch: Partial<QueryParams>) {
      queryParams.value = { ...queryParams.value, ...patch };
    }

    async function nextPage() {
      if (!pagination.value.hasNext) return;
      await fetchAll({ ...queryParams.value, page: pagination.value.page + 1 });
    }

    async function prevPage() {
      if (!pagination.value.hasPrev) return;
      await fetchAll({
        ...queryParams.value,
        page: Math.max(1, pagination.value.page - 1),
      });
    }

    function findById(id: string | number) {
      return items.value.find((item) => entityIdsMatch(readEntityIdentifier(item), id));
    }

    function $reset() {
      items.value = [];
      selected.value = null;
      isLoading.value = false;
      isSaving.value = false;
      error.value = null;
      pagination.value = emptyPaginationMeta();
      queryParams.value = { page: 1, perPage: 15 };
      lastFetched.value = null;
    }

    const exposedBindings: ResourceStoreBindings<T> = {
      items,
      selected,
      isLoading,
      isSaving,
      error,
      pagination,
      queryParams,
      lastFetched,
      isEmpty,
      isStale,
      fetchAll,
      fetchOne,
      create,
      update,
      remove,
      setQuery,
      nextPage,
      prevPage,
      findById,
      $reset,
    };

    const customizedBindings = extend?.(exposedBindings) ?? {};
    return { ...exposedBindings, ...customizedBindings };
  });
}
