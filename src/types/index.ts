export type { PaginatedResponse, PaginationMeta, QueryParams } from './resource';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}
