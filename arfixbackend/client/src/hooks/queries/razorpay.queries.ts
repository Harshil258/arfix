import { useQuery } from "@tanstack/react-query";
import {
  getRazorpayBalance,
  getRazorpayTopups,
  getRazorpayTransactions,
} from "@/api/razorpayApi";

export const useRazorpayBalanceQuery = () =>
  useQuery({
    queryKey: ["razorpay", "balance"],
    queryFn: getRazorpayBalance,
  });

export const useRazorpayTransactionsQuery = (params: {
  page: number;
  limit?: number;
  from?: string;
  to?: string;
}) =>
  useQuery({
    queryKey: [
      "razorpay",
      "transactions",
      params.page,
      params.limit ?? 20,
      params.from ?? "",
      params.to ?? "",
    ],
    queryFn: () => getRazorpayTransactions(params),
  });

export const useRazorpayTopupsQuery = (page: number) =>
  useQuery({
    queryKey: ["razorpay", "topups", page],
    queryFn: () => getRazorpayTopups({ page, limit: 10 }),
  });
