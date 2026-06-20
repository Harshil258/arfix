import { axiosInstance } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface CouponSessionCreator {
  id: string;
  name: string;
  email: string;
}

export interface CouponSessionItem {
  id: string;
  quantity: number;
  price: number;
  couponCount: number;
  createdAt: string;
  createdBy: CouponSessionCreator | null;
}

export interface CouponSessionsPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CouponSessionsListResponse {
  sessions: CouponSessionItem[];
  pagination: CouponSessionsPagination;
}

export interface CouponSessionsListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export const getCouponSessions = async (
  params: CouponSessionsListParams = {},
): Promise<CouponSessionsListResponse> => {
  const queryParams: Record<string, string | number> = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  };
  if (params.sortBy) queryParams.sortBy = params.sortBy;
  if (params.order) queryParams.order = params.order;

  const response = await axiosInstance.get(API_ENDPOINTS.coupons.sessions, {
    params: queryParams,
  });
  return response.data.data as CouponSessionsListResponse;
};

export interface CreateCouponSessionPayload {
  quantity: number;
  price: number;
}

export const createCouponSession = async (
  payload: CreateCouponSessionPayload,
): Promise<unknown> => {
  const response = await axiosInstance.post(API_ENDPOINTS.coupons.create, payload);
  return response.data.data;
};

export const downloadCouponSessionPdf = async (sessionId: string): Promise<Blob> => {
  const response = await axiosInstance.get(API_ENDPOINTS.coupons.sessionPdf(sessionId), {
    responseType: "blob",
  });
  const blob = response.data as Blob;
  if (blob.type === "application/json") {
    const text = await blob.text();
    let message = "Failed to download PDF.";
    try {
      const json = JSON.parse(text) as { message?: string };
      if (json.message) message = json.message;
    } catch {
      /* keep default message */
    }
    throw new Error(message);
  }
  return blob;
};

export interface ScanCouponPayload {
  code: string;
  id: string;
  userId: string;
}

export const scanCoupon = async (payload: ScanCouponPayload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.coupons.scan, payload);
  return response.data;
};

export interface ScanHistoryItem {
  id: string;
  couponCode: string;
  coinsEarned: number;
  productName: string | null;
  productImage: string | null;
  scannedAt: string;
}

export interface ScanHistoryResponse {
  scans: ScanHistoryItem[];
  pagination: CouponSessionsPagination;
  summary: { totalScans: number; totalCoinsEarned: number };
}

export const getScanHistory = async (params?: {
  page?: number;
  limit?: number;
}): Promise<ScanHistoryResponse> => {
  const response = await axiosInstance.get(API_ENDPOINTS.coupons.history, { params });
  return response.data.data as ScanHistoryResponse;
};
