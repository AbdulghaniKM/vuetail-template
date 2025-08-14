import { defineStore } from 'pinia';
import { ref } from 'vue';
import productsService from '../services/products';
import type { Product } from '../types';
export const useProducts = defineStore('products', () => {
  const products = ref<Product[]>([]);
  const featuredProducts = ref<Product[]>([]);
  const currentSingleProduct = ref<Product>();
  const getAllProducts = async () => {
    products.value = await productsService.getAllProducts();
    return products.value;
  };
  const getFeaturedProducts = async () => {
    featuredProducts.value = await productsService.getFeaturedProducts();
    return featuredProducts.value;
  };

  const getSingleProduct = async (id: string) => {
    currentSingleProduct.value = await productsService.getSingleProduct(id);
    return currentSingleProduct.value;
  };

  return {
    products,
    featuredProducts,
    currentSingleProduct,
    getSingleProduct,
    getAllProducts,
    getFeaturedProducts,
  };
});
