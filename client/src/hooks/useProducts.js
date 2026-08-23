import { useQuery } from "@tanstack/react-query";
import * as productsServices from "../services/products.service";

export const useProducts = (categoryId) => {
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
  return { getCategoryProductsQuery, getProductsQuery, getNewArrivalsQuery };
};
