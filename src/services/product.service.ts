import { BaseApiService } from './BaseApiService';

export class ProductService extends BaseApiService<Product> {
  constructor() {
    super(API_PATHS.PRODUCTS.ROOT);
  }

  async getFeatured({ signal }: RequestOptions = {}): Promise<Product[]> {
    const { data: featuredProducts } = await api.get<Product[]>(API_PATHS.PRODUCTS.FEATURED, {
      signal,
    });
    return featuredProducts;
  }
}

export const productService = new ProductService();
