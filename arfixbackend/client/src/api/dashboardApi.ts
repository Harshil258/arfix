import { axiosInstance } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { SupportStatus } from "@/api/supportApi";

export interface DashboardEndUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface DashboardSupportRow {
  id: string;
  subject: string;
  status: SupportStatus;
  isReadByStaff: boolean;
  createdAt: string;
  user: { name: string; email: string } | null;
}

export interface DashboardSummaryResponse {
  stats: {
    endUserCount: number;
    productCount: number;
    couponSpendTotal: number;
  };
  recentEndUsers: DashboardEndUser[];
  recentSupport: DashboardSupportRow[];
}

export const getDashboardSummary = async (): Promise<DashboardSummaryResponse> => {
  const response = await axiosInstance.get(API_ENDPOINTS.dashboard.summary);
  return response.data.data as DashboardSummaryResponse;
};
