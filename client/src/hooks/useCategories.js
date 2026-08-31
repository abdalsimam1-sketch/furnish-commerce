import * as catergoriesService from "../services/categories.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCategories = () => {
  const queryClient = useQueryClient();
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: catergoriesService.getCategories,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  const addNewCategoryMutation = useMutation({
    mutationFn: ({ categoryName, categoryImage }) =>
      catergoriesService.addNewCategory(categoryName, categoryImage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
  return {
    categoriesQuery,
    addNewCategoryMutation,
  };
};
