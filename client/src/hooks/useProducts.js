import { useQuery } from "@tanstack/react-query";
import * as productsServices from "../services/products.service";
export const useProducts = (categoryId) => {
  const getCategoryProductsQuery = useQuery({
    queryKey: ["category products", categoryId],
    queryFn: () => productsServices.getCategoryProducts(categoryId),
    enabled: !!categoryId,
  });
  return { getCategoryProductsQuery };
};
