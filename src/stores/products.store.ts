import { ref } from 'vue';
import { createResourceStore } from '@/stores/factory';
import { productService } from '@/services/products';
import type { Product } from '@/types';

export const useProductStore = createResourceStore<Product>('products', productService, () => {
  const featured = ref<Product[]>([]);

  const fetchFeatured = async () => {
    featured.value = await productService.getFeatured();
  };

  return { featured, fetchFeatured };
});
