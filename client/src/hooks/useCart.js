import * as cartServices from "../services/cart.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCart = () => {
  const queryClient = useQueryClient();

  const getCartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: cartServices.getCartService,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });

  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity = 1 }) =>
      cartServices.addToCartService(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item added to cart");
    },
  });

  const increaseMutation = useMutation({
    mutationFn: cartServices.increaseItemService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  const decreaseMutation = useMutation({
    mutationFn: cartServices.decreaseItemService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  const removeItemMutation = useMutation({
    mutationFn: cartServices.removeItemService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  const clearCartMutation = useMutation({
    mutationFn: cartServices.clearCartService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  return {
    getCartQuery,
    addToCartMutation,
    increaseMutation,
    decreaseMutation,
    removeItemMutation,
    clearCartMutation,
  };
};
