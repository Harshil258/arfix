import { axiosInstance } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface WalletSummary {
  balance: number;
  totalEarned: number;
  totalRedeemed: number;
  totalScans: number;
  memberSince: string;
}

export type WalletTransactionType = "EARNED" | "REDEEMED" | "BONUS";

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  coins: number;
  title: string;
  description: string;
  createdAt: string;
}

export interface WalletTransactionsParams {
  page?: number;
  limit?: number;
  type?: WalletTransactionType;
}

export const getWalletSummary = async (): Promise<WalletSummary> => {
  const response = await axiosInstance.get(API_ENDPOINTS.wallet.summary);
  return response.data.data as WalletSummary;
};

export const getWalletTransactions = async (params: WalletTransactionsParams = {}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.wallet.transactions, { params });
  return response.data.data as {
    transactions: WalletTransaction[];
    pagination: { page: number; limit: number; total: number; pages: number };
  };
};
