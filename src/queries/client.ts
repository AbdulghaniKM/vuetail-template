import { QueryClient } from '@tanstack/vue-query';

// One cache for the whole app, installed in main.ts with VueQueryPlugin.
//
// staleTime: data younger than a minute is served from the cache without a request. Older data
//   is still shown at once, then refetched in the background.
// retry: off. The axios interceptor (registerErrorToasts in main.ts) toasts every failed request,
//   so each retry would toast again. Queries still recover on their own: they refetch when the
//   window regains focus and when the network comes back. Turn retry on per query if you need it.
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

export const queryClient = createQueryClient();
