import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as productsServices from "../services/products.service";

export const useProducts = (categoryId) => {
  const queryClient = useQueryClient();
  const getCategoryProductsQuery = useQuery({
    queryKey: ["category products", categoryId],
    queryFn: () => productsServices.getCategoryProducts(categoryId),
    enabled: !!categoryId,
  });
  const getProductsQuery = (page, limit, search, categoryId) =>
    useQuery({
      queryKey: ["products", page, limit, search, categoryId],
      queryFn: () =>
        productsServices.getProducts(page, limit, search, categoryId),
      staleTime: 5 * 60 * 1000,
    });
  const getNewArrivalsQuery = useQuery({
    queryKey: ["new arrivals"],
    queryFn: productsServices.getNewArrivals,

    staleTime: 5 * 60 * 1000,
  });
  const addProductMutation = useMutation({
    mutationFn: productsServices.addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
  const editProductMutation = useMutation({
    mutationFn: ({ productId, productForm }) =>
      productsServices.editProduct(productId, productForm),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
  const deleteProductMutation = useMutation({
    mutationFn: productsServices.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
  return {
    getCategoryProductsQuery,
    getProductsQuery,
    getNewArrivalsQuery,
    addProductMutation,
    editProductMutation,
    deleteProductMutation,
  };
};
