import { api } from "../api/api";

export const getCategoryProducts = async (categoryId) => {
  const response = await api.get(`/products/${categoryId}`);
  return response.data;
};

export const getProducts = async (page, limit, search, categoryId) => {
  const response = await api.get("/products", {
    params: {
      page,
      limit,
      search,
      categoryId,
    },
  });
  return response.data;
};
export const getNewArrivals = async () => {
  const response = await api.get("/products/new-arrivals");
  return response.data;
};
