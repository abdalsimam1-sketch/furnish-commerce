import { api } from "../api/api";

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const addNewCategory = async (categoryName, categoryImage) => {
  const formData = new FormData();
  formData.append("name", categoryName);
  formData.append("categoryImage", categoryImage);
  const response = await api.post("/categories", formData);
  return response.data;
};
