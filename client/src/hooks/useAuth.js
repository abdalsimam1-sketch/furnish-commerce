import * as authServices from "../services/auth.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: authServices.getMe,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const signupMutation = useMutation({
    mutationFn: authServices.signup,
    onSuccess: () => {
      toast.success("Account created! Check your email to verify.");
    },
    onError: () => {
      toast.error("Signup failed");
    },
  });

  const loginMutation = useMutation({
    mutationFn: authServices.login,
    onSuccess: () => {
      toast.success("Login successful");
      queryClient.invalidateQueries(["me"]);
    },
    onError: () => {
      toast.error("Login failed");
    },
  });
  const logoutMutation = useMutation({
    mutationFn: authServices.logout,
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: authServices.verifyEmail,
  });

  const resendVerificationEmailMutation = useMutation({
    mutationFn: authServices.resendVerificationEmail,
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authServices.forgotPassword,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, payload }) =>
      authServices.resetPassword(token, payload),
  });

  return {
    signupMutation,
    loginMutation,
    logoutMutation,
    meQuery,
    verifyEmailMutation,
    resendVerificationEmailMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
  };
};
