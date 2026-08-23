import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as orderServices from "../services/order.service";

export const useOrders = () => {
  const queryClient = useQueryClient();
  const getSpecificOrderQuery = (orderId) =>
    useQuery({
      queryKey: ["specificOrder", orderId],
      queryFn: () => orderServices.getSpecificOrder(orderId),
      enabled: !!orderId,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });
  const getUsersOrdersQuery = useQuery({
    queryKey: ["user orders"],
    queryFn: orderServices.getUsersOrders,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const cancelOrderMutation = useMutation({
    mutationFn: orderServices.cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user orders"] });
    },
  });
  return { getSpecificOrderQuery, getUsersOrdersQuery, cancelOrderMutation };
};
