import api from '../plugins/axios';
const getAllProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

const getFeaturedProducts = async () => {
  const response = await api.get('/products/shuffle');
  return response.data;
};

const getSingleProduct = async (id: string) => {
  const response = await api.get('/products/' + id);
  return response.data;
};

export default {
  getAllProducts,
  getFeaturedProducts,
  getSingleProduct,
};
