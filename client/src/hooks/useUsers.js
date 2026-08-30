import * as usersServices from "../services/users.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const getUsersQuery = (page, limit, search) =>
    useQuery({
      queryFn: () => usersServices.getUsers(page, limit, search),
      queryKey: ["users", page, limit, search],
      staleTime: 5 * 60 * 1000,
    });

  return {
    updateAvatarMutation,
    updateUserInfoMutation,
    resetPasswordMutation,
    getUsersQuery,
  };
};
