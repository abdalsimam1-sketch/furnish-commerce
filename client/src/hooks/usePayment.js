import * as paymentServices from "../services/payment.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePayment = () => {
  const queryClient = useQueryClient();
  const initializePaymentMutation = useMutation({
    mutationFn: paymentServices.initializePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user orders"] });
    },
  });
  return { initializePaymentMutation };
};
