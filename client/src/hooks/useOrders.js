import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as orderServices from "../services/orders.service";

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
  const getOrderByReferenceQuery = (paymentReference) =>
    useQuery({
      queryKey: ["order by reference", paymentReference],
      queryFn: () => orderServices.getOrderByReference(paymentReference),
      staleTime: 5 * 1000 * 60,
      refetchOnMount: true,
      retry: false,
      enabled: !!paymentReference,
    });
  const getOrdersQuery = (page, limit, search, status) =>
    useQuery({
      queryKey: ["orders", page, limit, search, status],
      queryFn: () => orderServices.getOrders(page, limit, search, status),
    });
  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, newStatus }) =>
      orderServices.updateOrderStatus(orderId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
  return {
    getSpecificOrderQuery,
    getUsersOrdersQuery,
    cancelOrderMutation,
    getOrderByReferenceQuery,
    getOrdersQuery,
    updateOrderMutation,
  };
};
