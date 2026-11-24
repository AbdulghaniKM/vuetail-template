import { useQuery } from '@tanstack/vue-query';
import { productService } from '@/services/product.service';
import { createResourceQueries } from './factory';

const products = createResourceQueries('products', productService);

export const productKeys = {
  ...products.keys,
  featured: () => [...products.keys.all, 'featured'] as const,
};

// const { data, isPending, error } = useProducts(() => ({ page: page.value, search: search.value }));
export const useProducts = products.useList;
// const { data: product } = useProduct(() => String(route.params.id));
export const useProduct = products.useOne;
// const { mutate: createProduct, isPending } = useCreateProduct();
export const useCreateProduct = products.useCreate;
// updateProduct({ id, patch: { price: 12 } })
export const useUpdateProduct = products.useUpdate;
// deleteProduct(id)
export const useDeleteProduct = products.useRemove;

export const useFeaturedProducts = () =>
  useQuery({
    queryKey: productKeys.featured(),
    queryFn: ({ signal }) => productService.getFeatured({ signal }),
  });
