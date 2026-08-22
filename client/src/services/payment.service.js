import { api } from "../api/api";

export const getPayments = async (page, limit, search) => {
  const response = await api.get("/payments", {
    params: {
      page,
      limit,
      search,
    },
  });
  return response.data;
};

export const getUserPayments = async () => {
  const response = await api.get("/payments/user-payments");
  return response.data;
};

export const initializePayment = async (checkoutForm) => {
  const response = await api.post("/payments/initialize", checkoutForm);
  return response.data;
};

export const getSpecificPayment = async (paymentId) => {
  const response = await api.get(`/payments/${paymentId}`);
  return response.data;
};
