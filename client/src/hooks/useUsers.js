import * as usersServices from "../services/users.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUsers = () => {
  const queryClient = useQueryClient();
  const updateUserInfoMutation = useMutation({
    mutationFn: usersServices.updateUserInfo,
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
    },
  });
  const resetPasswordMutation = useMutation({
    mutationFn: usersServices.resetPassword,
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
    },
  });
  const updateAvatarMutation = useMutation({
    mutationFn: usersServices.updateAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
    },
  });

  return {
    updateAvatarMutation,
    updateUserInfoMutation,
    resetPasswordMutation,
  };
};
