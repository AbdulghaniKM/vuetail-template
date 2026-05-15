import api from '@/plugins/axios';
import type { PaginatedResponse, PaginationMeta, QueryParams } from '@/types/resource';

function paginationMetaForBareArrayResponse(
  elementCount: number,
  page = 1,
  requestedPerPage?: number,
): PaginationMeta {
  const perPage = requestedPerPage ?? Math.max(elementCount, 1);
  return {
    page,
    perPage,
    total: elementCount,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  };
}

export abstract class BaseApiService<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  constructor(protected readonly basePath: string) {}

  protected coerceToPaginatedResponse(
    responseBody: T[] | PaginatedResponse<T>,
    query?: QueryParams,
  ): PaginatedResponse<T> {
    if (Array.isArray(responseBody)) {
      return {
        data: responseBody,
        meta: paginationMetaForBareArrayResponse(
          responseBody.length,
          query?.page ?? 1,
          query?.perPage,
        ),
      };
    }
    return responseBody;
  }

  async findAll(params?: QueryParams): Promise<PaginatedResponse<T>> {
    const { data: responseBody } = await api.get<T[] | PaginatedResponse<T>>(this.basePath, {
      params: params as Record<string, unknown> | undefined,
    });
    return this.coerceToPaginatedResponse(responseBody, params);
  }

  async findOne(id: string | number): Promise<T> {
    const { data: entity } = await api.get<T>(`${this.basePath}/${id}`);
    return entity;
  }

  async create(draft: CreateDto): Promise<T> {
    const { data: created } = await api.post<T>(this.basePath, draft);
    return created;
  }

  async update(id: string | number, patch: UpdateDto): Promise<T> {
    const { data: updated } = await api.patch<T>(`${this.basePath}/${id}`, patch);
    return updated;
  }

  async remove(id: string | number): Promise<void> {
    await api.delete(`${this.basePath}/${id}`);
  }
}
