import { axiosInstance } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export type LeaderboardPeriod = "WEEKLY" | "MONTHLY" | "ALL_TIME";

export const getLeaderboard = async (params?: { period?: LeaderboardPeriod }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.leaderboard, { params });
  return response.data.data;
};

export const getCampaigns = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.campaigns);
  return response.data.data as { campaigns: unknown[] };
};

export const getBanners = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.banners);
  return response.data.data as { banners: unknown[] };
};

export const registerFcmToken = async (payload: {
  fcmToken: string;
  platform?: "android" | "ios";
}) => {
  const response = await axiosInstance.post(API_ENDPOINTS.notifications.register, payload);
  return response.data;
};

export const getNotifications = async (params?: { page?: number; limit?: number }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.notifications.list, { params });
  return response.data.data;
};

export const markNotificationRead = async (id: string) => {
  const response = await axiosInstance.patch(API_ENDPOINTS.notifications.markRead(id));
  return response.data;
};
