import { useQuery } from "@tanstack/react-query";
import {
  getAllWithdrawals,
  getPendingWithdrawalCount,
  type WithdrawalsListParams,
} from "@/api/withdrawalApi";

export const useWithdrawalCountsQuery = () =>
  useQuery({
    queryKey: ["withdrawals", "counts"],
    queryFn: getPendingWithdrawalCount,
  });

export const useWithdrawalsQuery = (params: WithdrawalsListParams) =>
  useQuery({
    queryKey: [
      "withdrawals",
      "list",
      params.page ?? 1,
      params.limit ?? 10,
      params.status ?? "",
      params.startDate ?? "",
      params.endDate ?? "",
    ],
    queryFn: () => getAllWithdrawals(params),
  });
