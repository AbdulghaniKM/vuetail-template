import { productService } from '@/services/product.service';

export const useProductStore = createResourceStore<Product>('products', productService, () => {
  const featured = ref<Product[]>([]);

  const fetchFeatured = async () => {
    featured.value = await productService.getFeatured();
  };

  return { featured, fetchFeatured };
});
