import api from '../plugins/axios';
import { API_PATHS } from '../config/api-paths';

const getAllProducts = async () => {
  const productsResponse = await api.get(API_PATHS.PRODUCTS.ALL);
  return productsResponse.data;
};

const getFeaturedProducts = async () => {
  const featuredResponse = await api.get(API_PATHS.PRODUCTS.SHUFFLE);
  return featuredResponse.data;
};

const getSingleProduct = async (id: string) => {
  const productResponse = await api.get(API_PATHS.PRODUCTS.SINGLE(id));
  return productResponse.data;
};

export default {
  getAllProducts,
  getFeaturedProducts,
  getSingleProduct,
};
