import { axiosInstance } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export type SupportStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface SupportUserRef {
  id: string;
  name: string;
  email: string;
}

export interface SupportMessageListItem {
  id: string;
  subject: string;
  preview: string;
  status: SupportStatus;
  isReadByStaff: boolean;
  createdAt: string;
  updatedAt: string;
  user: SupportUserRef | null;
}

export interface SupportMessageDetail extends Omit<SupportMessageListItem, "preview"> {
  message: string;
}

export interface SupportMessagesPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface SupportMessagesListResponse {
  messages: SupportMessageListItem[];
  pagination: SupportMessagesPagination;
}

export interface SupportMessagesListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  status?: SupportStatus;
  unreadOnly?: boolean;
}

/** Admin/staff inbox */
export const getSupportMessages = async (
  params: SupportMessagesListParams = {},
): Promise<SupportMessagesListResponse> => {
  const queryParams: Record<string, string | number> = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  };
  if (params.sortBy) queryParams.sortBy = params.sortBy;
  if (params.order) queryParams.order = params.order;
  if (params.status) queryParams.status = params.status;
  if (params.unreadOnly === true) queryParams.unreadOnly = "true";
  if (params.unreadOnly === false) queryParams.unreadOnly = "false";

  const response = await axiosInstance.get(API_ENDPOINTS.support.messages, {
    params: queryParams,
  });
  return response.data.data as SupportMessagesListResponse;
};

export const getSupportMessage = async (id: string): Promise<SupportMessageDetail> => {
  const response = await axiosInstance.get(API_ENDPOINTS.support.messageById(id));
  return (response.data.data as { message: SupportMessageDetail }).message;
};

export interface UpdateSupportMessagePayload {
  status?: SupportStatus;
  isReadByStaff?: boolean;
}

export const updateSupportMessage = async (
  id: string,
  payload: UpdateSupportMessagePayload,
): Promise<SupportMessageDetail> => {
  const response = await axiosInstance.patch(API_ENDPOINTS.support.messageById(id), payload);
  return (response.data.data as { message: SupportMessageDetail }).message;
};

export interface CreateSupportMessagePayload {
  subject: string;
  message: string;
}

export const createSupportMessage = async (
  payload: CreateSupportMessagePayload,
): Promise<SupportMessageDetail> => {
  const response = await axiosInstance.post(API_ENDPOINTS.support.messages, payload);
  return (response.data.data as { message: SupportMessageDetail }).message;
};

/** Mobile — current user's tickets */
export const getMySupportMessages = async (
  params: SupportMessagesListParams = {},
): Promise<SupportMessagesListResponse> => {
  const response = await axiosInstance.get(API_ENDPOINTS.support.myMessages, { params });
  return response.data.data as SupportMessagesListResponse;
};

export const getMySupportMessage = async (
  messageId: string,
): Promise<SupportMessageDetail> => {
  const response = await axiosInstance.get(API_ENDPOINTS.support.myMessageById(messageId));
  return (response.data.data as { message: SupportMessageDetail }).message;
};
