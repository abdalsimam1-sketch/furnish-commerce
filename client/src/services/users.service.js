import { api } from "../api/api";

export const updateUserInfo = async (userForm) => {
  const response = await api.patch(`/users/update-user-info`, userForm);
  return response.data;
};

export const resetPassword = async (passwordForm) => {
  const response = await api.patch(`/users/reset-password`, passwordForm);
  return response.data;
};

export const updateAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await api.post(`/users/update-avatar`, formData);
  return response.data;
};

export const getUsers = async (page, limit, search) => {
  const response = await api.get("/users", {
    params: {
      page,
      limit,
      search,
    },
  });
  return response.data;
};
