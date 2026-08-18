import { api } from "../api/api";

export const getCartService = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const addToCartService = async (productId, quantity = 1) => {
  const response = await api.post(`/cart/add-to-cart/${productId}`, {
    quantity,
  });
  return response.data;
};

export const increaseItemService = async (productId) => {
  const response = await api.post(`/cart/increase/${productId}`);
  return response.data;
};

export const removeItemService = async (productId) => {
  const response = await api.delete(`/cart/remove/${productId}`);
  return response.data;
};

export const decreaseItemService = async (productId) => {
  const response = await api.post(`/cart/decrease/${productId}`);
  return response.data;
};

export const clearCartService = async () => {
  const response = await api.delete(`/cart/clear-cart`);
  return response.data;
};
