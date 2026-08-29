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
export const editProduct = async (productId, productForm) => {
  const formData = new FormData();
  formData.append("name", productForm.name);
  formData.append("description", productForm.description);
  formData.append("price", productForm.price);
  formData.append("inStock", productForm.inStock);
  formData.append("categoryId", productForm.categoryId);
  if (productForm.image) {
    formData.append("productImage", productForm.image);
  }
  const response = await api.patch(
    `/products/edit-product/${productId}`,
    formData,
  );
  return response.data;
};
export const addProduct = async (productForm) => {
  const formData = new FormData();
  formData.append("name", productForm.name);
  formData.append("description", productForm.description);
  formData.append("price", productForm.price);
  formData.append("inStock", productForm.inStock);
  formData.append("categoryId", productForm.categoryId);
  formData.append("productImage", productForm.image);
  const response = await api.post("/products/add-product", formData);
  return response.data;
};
export const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/delete-product/${productId}`);
  return response.data;
};
