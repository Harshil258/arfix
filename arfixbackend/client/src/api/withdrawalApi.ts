import { axiosInstance } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

/** Matches server `WithdrawalStatus` enum (lowercase). */
export type WithdrawalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "failed";

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName?: string;
}

export interface WithdrawalUserRef {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  coins?: number;
}

export interface WithdrawalItem {
  _id: string;
  user: WithdrawalUserRef | string;
  amount: number;
  status: WithdrawalStatus;
  bankDetails: BankDetails;
  rejectionReason?: string | null;
  razorpayPayoutId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalCounts {
  pending: number;
  approved: number;
  rejected: number;
  completed: number;
  total: number;
}

export interface WithdrawalsListParams {
  page?: number;
  limit?: number;
  status?: WithdrawalStatus;
  startDate?: string;
  endDate?: string;
}

export const requestWithdrawal = async (payload: {
  amount: number;
  bankDetails: BankDetails;
}) => {
  const response = await axiosInstance.post(API_ENDPOINTS.withdrawals.list, payload);
  return response.data.data as { withdrawal: WithdrawalItem };
};

export const getPendingWithdrawalCount = async (): Promise<WithdrawalCounts> => {
  const response = await axiosInstance.get(API_ENDPOINTS.withdrawals.pendingCount);
  return response.data.data as WithdrawalCounts;
};

export const getAllWithdrawals = async (params: WithdrawalsListParams = {}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.withdrawals.list, { params });
  return response.data.data as {
    withdrawals: WithdrawalItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalRecords: number;
      recordsPerPage: number;
    };
  };
};

export const getWithdrawalStatus = async (userId: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.withdrawals.userStatus(userId));
  return response.data.data as { withdrawal: WithdrawalItem };
};

export const getWithdrawalHistory = async (
  userId: string,
  params?: { page?: number; limit?: number },
) => {
  const response = await axiosInstance.get(API_ENDPOINTS.withdrawals.userHistory(userId), {
    params,
  });
  return response.data.data;
};

export const approveWithdrawal = async (withdrawalId: string) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.withdrawals.approve(withdrawalId),
  );
  return response.data;
};

export const rejectWithdrawal = async (
  withdrawalId: string,
  payload: { rejectionReason: string },
) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.withdrawals.reject(withdrawalId),
    payload,
  );
  return response.data;
};
