import * as catergoriesService from "../services/categories.service";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: catergoriesService.getCategories,
  });
  return {
    categoriesQuery,
  };
};
