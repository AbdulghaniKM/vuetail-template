export const API_PATHS = {
  PRODUCTS: {
    ALL: '/products',
    SHUFFLE: '/products/shuffle',
    SINGLE: (id: string) => `/products/${id}`,
  },
  UPLOAD: '/upload',
} as const;
