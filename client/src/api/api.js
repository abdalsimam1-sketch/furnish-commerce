import axios from "axios";
import { rotateTokens } from "../services/auth.service";
export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }
    if (
      originalRequest.url.includes("/auth/signup") ||
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/rotate-tokens")
    ) {
      return Promise.reject(error);
    }
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    try {
      await rotateTokens();
      return api(originalRequest);
    } catch (rotateError) {
      return Promise.reject(rotateError);
    }
  },
);
