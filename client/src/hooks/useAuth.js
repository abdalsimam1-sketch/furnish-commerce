import * as authServices from "../services/auth.service";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAuth = () => {
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: authServices.getMe,
    retry: false,
    refetchOnWindowFocus: false,
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
    },
    onError: () => {
      toast.error("Login failed");
    },
  });
  const logoutMutation = useMutation({
    mutationFn: authServices.logout,
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
