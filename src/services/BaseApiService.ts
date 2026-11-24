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

/**
 * Typed REST CRUD for one resource. HTTP only: no state, no caching (that is the job of
 * `src/queries/`). Reads take `{ signal }` so a cancelled query aborts its request.
 */
export class BaseApiService<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
  /** @param basePath the resource's collection URL, e.g. `API_PATHS.PRODUCTS.ROOT`. */
  constructor(protected readonly basePath: string) {}

  /** The URL of one item: `<basePath>/<id>`. */
  protected itemPath(id: Id): string {
    return `${this.basePath}/${encodeURIComponent(String(id))}`;
  }

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

  async findAll(
    params?: QueryParams,
    { signal }: RequestOptions = {},
  ): Promise<PaginatedResponse<T>> {
    const { data: responseBody } = await api.get<T[] | PaginatedResponse<T>>(this.basePath, {
      params: params as Record<string, unknown> | undefined,
      signal,
    });
    return this.coerceToPaginatedResponse(responseBody, params);
  }

  async findOne(id: Id, { signal }: RequestOptions = {}): Promise<T> {
    const { data: entity } = await api.get<T>(this.itemPath(id), { signal });
    return entity;
  }

  async create(draft: CreateDto): Promise<T> {
    const { data: created } = await api.post<T>(this.basePath, draft);
    return created;
  }

  async update(id: Id, patch: UpdateDto): Promise<T> {
    const { data: updated } = await api.patch<T>(this.itemPath(id), patch);
    return updated;
  }

  async remove(id: Id): Promise<void> {
    await api.delete(this.itemPath(id));
  }
}
