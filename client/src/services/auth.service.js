import { api } from "../api/api";

export const signup = async (payload) => {
  const response = await api.post("/auth/signup", payload);
  return response.data;
};

export const login = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};
export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const rotateTokens = async () => {
  const response = await api.post("/auth/rotate-tokens");
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data;
};

export const resendVerificationEmail = async (payload) => {
  const response = await api.post("/auth/resend-verification-email", payload);
  return response.data;
};

export const forgotPassword = async (payload) => {
  const response = await api.post("/auth/forgot-password", payload);
  return response.data;
};

export const resetPassword = async (token, payload) => {
  const response = await api.post(`/auth/reset-password/${token}`, payload);
  return response.data;
};
