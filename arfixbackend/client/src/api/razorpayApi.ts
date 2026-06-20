import { axiosInstance } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface RazorpayBalanceAccount {
  accountNumber?: string;
  balanceInr: number;
  availableBalanceInr: number;
  accountType?: string;
  bankName?: string;
}

export interface RazorpayBalanceResponse {
  accountNumber: string | null;
  balanceInr: number;
  availableBalanceInr: number;
  currency: string;
  accountType: string | null;
  bankName: string | null;
  refreshedAt: string | null;
  allAccounts: RazorpayBalanceAccount[];
}

export interface RazorpayTransaction {
  id: string;
  type: "CREDIT" | "DEBIT";
  amountInr: number;
  balanceAfterInr: number | null;
  currency: string;
  sourceType: string | null;
  sourceId: string | null;
  createdAt: string;
}

export interface RazorpayTopupItem {
  id: string;
  amountInr: number;
  paymentLinkId: string;
  shortUrl: string;
  status: string;
  note?: string;
  createdAt: string;
  createdBy: { id: string; name?: string; email?: string } | null;
}

export const getRazorpayBalance = async (): Promise<RazorpayBalanceResponse> => {
  const response = await axiosInstance.get(API_ENDPOINTS.razorpay.balance);
  return response.data.data as RazorpayBalanceResponse;
};

export const getRazorpayTransactions = async (params?: {
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.razorpay.transactions, { params });
  return response.data.data as {
    accountNumber: string;
    transactions: RazorpayTransaction[];
    pagination: { page: number; limit: number; count: number; hasMore: boolean };
  };
};

export const createRazorpayTopup = async (payload: { amount: number; note?: string }) => {
  const response = await axiosInstance.post(API_ENDPOINTS.razorpay.topup, payload);
  return response.data.data as { topup: RazorpayTopupItem };
};

export const getRazorpayTopups = async (params?: { page?: number; limit?: number }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.razorpay.topups, { params });
  return response.data.data as {
    topups: RazorpayTopupItem[];
    pagination: { page: number; limit: number; total: number; pages: number };
  };
};
