import { axiosInstance } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export type AppUserRole = "user" | "admin" | "staff";

export type UserListType = "user" | "staff";

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: AppUserRole;
  isActive: boolean;
  coins: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: AppUserRole;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: AppUserRole;
  isActive?: boolean;
}

export const getUsers = async (listType: UserListType): Promise<UserListItem[]> => {
  const response = await axiosInstance.get(API_ENDPOINTS.users.list, { params: { listType } });
  return (response.data.data as { users: UserListItem[] }).users;
};

export const getUser = async (id: string): Promise<UserListItem> => {
  const response = await axiosInstance.get(API_ENDPOINTS.users.byId(id));
  return response.data.data as UserListItem;
};

export const createUser = async (payload: CreateUserPayload): Promise<UserListItem> => {
  const response = await axiosInstance.post(API_ENDPOINTS.users.list, payload);
  return response.data.data as UserListItem;
};

export const updateUser = async (
  id: string,
  payload: UpdateUserPayload,
): Promise<UserListItem> => {
  const response = await axiosInstance.patch(API_ENDPOINTS.users.byId(id), payload);
  return response.data.data as UserListItem;
};
