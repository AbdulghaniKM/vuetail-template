import api from '../plugins/axios';
import { API_PATHS } from '../config/api-paths';

const getAllProducts = async () => {
  const response = await api.get(API_PATHS.PRODUCTS.ALL);
  return response.data;
};

const getFeaturedProducts = async () => {
  const response = await api.get(API_PATHS.PRODUCTS.SHUFFLE);
  return response.data;
};

const getSingleProduct = async (id: string) => {
  const response = await api.get(API_PATHS.PRODUCTS.SINGLE(id));
  return response.data;
};

export default {
  getAllProducts,
  getFeaturedProducts,
  getSingleProduct,
};
