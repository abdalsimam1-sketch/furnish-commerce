import { api } from "../api/api";

export const getOrders = async (page, limit, search, status) => {
  const response = await api.get("/orders", {
    params: {
      page,
      limit,
      search,
      status,
    },
  });
  return response.data;
};

export const getUsersOrders = async () => {
  const response = await api.get("/orders/user-orders");
  return response.data;
};
export const updateOrderStatus = async (orderId, newStatus) => {
  const response = await api.patch(`/orders/update/${orderId}`, {
    status: newStatus,
  });
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await api.patch(`/orders/cancel/${orderId}`);
  return response.data;
};

export const getSpecificOrder = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const getOrderByReference = async (paymentReference) => {
  const response = await api.get(
    `/orders/get-order-by-payment-reference/${paymentReference}`,
  );
  return response.data;
};
