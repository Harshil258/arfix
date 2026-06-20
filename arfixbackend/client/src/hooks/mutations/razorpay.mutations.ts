import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRazorpayTopup } from "@/api/razorpayApi";

export const useCreateRazorpayTopupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRazorpayTopup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["razorpay", "topups"] });
      queryClient.invalidateQueries({ queryKey: ["razorpay", "balance"] });
    },
  });
};
