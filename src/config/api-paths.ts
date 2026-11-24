// Every endpoint, named once. Services read these; pages and components never hold a URL.
// A resource has a ROOT (its collection); BaseApiService derives item URLs (`ROOT/:id`) from it.
export const API_PATHS = {
  PRODUCTS: {
    ROOT: '/products',
    FEATURED: '/products/featured',
  },
  UPLOAD: '/upload',
} as const;
