import api from '@/plugins/axios';
import { API_PATHS } from '@/config/api-paths';
import type { Product } from '@/types';
import { BaseApiService } from '@/services/BaseApiService';

export class ProductService extends BaseApiService<Product> {
  constructor() {
    super(API_PATHS.PRODUCTS.ALL);
  }

  async getFeatured(): Promise<Product[]> {
    const { data: featuredProducts } = await api.get<Product[]>(API_PATHS.PRODUCTS.SHUFFLE);
    return featuredProducts;
  }

  async getSingleProduct(id: string): Promise<Product> {
    return this.findOne(id);
  }
}

export const productService = new ProductService();
