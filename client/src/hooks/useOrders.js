import { useQuery } from "@tanstack/react-query";
import * as orderServices from "../services/order.service";

export const useOrders = () => {
  const getSpecificOrderQuery = (orderId) =>
    useQuery({
      queryKey: ["specificOrder", orderId],
      queryFn: () => orderServices.getSpecificOrder(orderId),
      enabled: !!orderId,
    });
  return { getSpecificOrderQuery };
};
