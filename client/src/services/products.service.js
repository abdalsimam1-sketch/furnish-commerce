import { api } from "../api/api";

export const getCategoryProducts = async (categoryId) => {
  const response = await api.get(`/products/${categoryId}`);
  return response.data;
};
