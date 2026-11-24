import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/vue-query';
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

// ─── Optimistic update example ──────────────────────────────────────────────
//
// The other mutations wait for the server, then show its answer. That is the right default:
// the server can refuse, or change what it saves. For a small change that almost never fails,
// the wait makes the UI feel slow, so this one shows the change at once and undoes it if the
// server says no. Copy this shape for likes, checkboxes, "mark as done".
//
//   const { mutate: toggleFavorite } = useToggleFavorite();
//   <button :aria-pressed="product.favorite"
//     @click="toggleFavorite({ id: product.id, favorite: !product.favorite })">★</button>

/** Writes `favorite` into every cached copy of one product: its detail, each list, featured. */
function setFavoriteInCache(queryClient: QueryClient, id: Id, favorite: boolean) {
  const apply = (product: Product) =>
    String(product.id) === String(id) ? { ...product, favorite } : product;

  queryClient.setQueryData<Product>(productKeys.detail(id), (old) => old && apply(old));
  queryClient.setQueriesData<PaginatedResponse<Product>>(
    { queryKey: productKeys.lists() },
    (old) => old && { ...old, data: old.data.map(apply) },
  );
  queryClient.setQueryData<Product[]>(productKeys.featured(), (old) => old?.map(apply));
}

const favoriteKey = [...productKeys.all, 'favorite'] as const;

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: favoriteKey,
    mutationFn: ({ id, favorite }: { id: Id; favorite: boolean }) =>
      productService.update(id, { favorite }),

    // Before the request: show the change.
    onMutate: async ({ id, favorite }) => {
      // A refetch already on its way would land with the old value and undo the star.
      await queryClient.cancelQueries({ queryKey: productKeys.all });
      setFavoriteInCache(queryClient, id, favorite);
    },

    // The server said no: put this one product back. Undoing just this change, rather than
    // restoring a snapshot of the whole cache, keeps any other toggle made meanwhile.
    onError: (_error, { id, favorite }) => {
      setFavoriteInCache(queryClient, id, !favorite);
    },

    // Either way, fetch the truth. Only once the last toggle in a quick series has settled:
    // refetching between two toggles would briefly show the first one's server state.
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: favoriteKey }) === 1) {
        return queryClient.invalidateQueries({ queryKey: productKeys.all });
      }
    },
  });
};
