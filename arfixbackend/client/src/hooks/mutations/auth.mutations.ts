import {
  loginAdminUser,
  updateMyProfile,
  changeMyPassword,
  type LoginPayload,
  type UpdateMyProfilePayload,
  type ChangePasswordPayload,
} from "@/api/authApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type LoginPortal = "user" | "admin";

export const useLoginMutation = (portal: LoginPortal = "user") => {
  return useMutation({
    mutationKey: ["auth", "login", portal],
    mutationFn: (payload: LoginPayload) =>
      loginAdminUser(payload),
  });
};

export const useUpdateMyProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateMyProfilePayload) => updateMyProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};

export const useChangeMyPasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changeMyPassword(payload),
  });
};
