export type { PaginatedResponse, PaginationMeta, QueryParams } from './resource.types';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}
