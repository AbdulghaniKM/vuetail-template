/** A resource id as the API sends it. URLs and cache keys use it as-is. */
export type Id = string | number;

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface QueryParams {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  [key: string]: unknown;
}

/** Passed by TanStack Query to every queryFn: aborts the request when the query is cancelled. */
export interface RequestOptions {
  signal?: AbortSignal;
}
