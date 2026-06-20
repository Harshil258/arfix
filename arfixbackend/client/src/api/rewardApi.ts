import { axiosInstance } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export type RewardCategory = "CASHBACK" | "VOUCHER" | "PRODUCT" | "DISCOUNT";

export type RedemptionStatus = "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  coinsRequired: number;
  category: RewardCategory;
  image: string;
  stock: number;
  isActive: boolean;
  expiresAt: string | null;
}

export interface RedemptionItem {
  id: string;
  rewardTitle: string;
  coinsSpent: number;
  status: RedemptionStatus;
  createdAt: string;
  completedAt: string | null;
}

export const getRewards = async (params?: {
  page?: number;
  limit?: number;
  category?: RewardCategory;
}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.rewards.list, { params });
  return response.data.data as {
    rewards: RewardItem[];
    categories: RewardCategory[];
    pagination: { page: number; limit: number; total: number; pages: number };
  };
};

export const redeemReward = async (
  rewardId: string,
  payload?: { upiId?: string },
) => {
  const response = await axiosInstance.post(API_ENDPOINTS.rewards.redeem(rewardId), payload ?? {});
  return response.data.data as {
    redemption: {
      id: string;
      rewardTitle: string;
      coinsSpent: number;
      status: RedemptionStatus;
      estimatedDelivery: string;
      createdAt: string;
    };
    newBalance: number;
  };
};

export const getMyRedemptions = async (params?: { page?: number; limit?: number }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.rewards.redemptions, { params });
  return response.data.data as {
    redemptions: RedemptionItem[];
    pagination: { page: number; limit: number; total: number; pages: number };
  };
};
