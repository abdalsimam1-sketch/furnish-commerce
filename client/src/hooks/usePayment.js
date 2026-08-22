import * as paymentServices from "../services/payment.service";
import { useMutation } from "@tanstack/react-query";

export const usePayment = () => {
  const initializePaymentMutation = useMutation({
    mutationFn: paymentServices.initializePayment,
  });
  return { initializePaymentMutation };
};
