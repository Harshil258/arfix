import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCouponSession,
  type CreateCouponSessionPayload,
} from "@/api/couponApi";

export const useCreateCouponSessionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCouponSessionPayload) => createCouponSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["couponSessions"] });
    },
  });
};
