import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveWithdrawal, rejectWithdrawal } from "@/api/withdrawalApi";

export const useApproveWithdrawalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (withdrawalId: string) => approveWithdrawal(withdrawalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
    },
  });
};

export const useRejectWithdrawalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      withdrawalId,
      rejectionReason,
    }: {
      withdrawalId: string;
      rejectionReason: string;
    }) => rejectWithdrawal(withdrawalId, { rejectionReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
    },
  });
};
