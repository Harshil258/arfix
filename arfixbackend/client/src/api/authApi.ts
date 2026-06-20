import { axiosInstance } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { AppUserRole } from "@/api/userApi";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthMeUser {
  id: string;
  name: string;
  email: string;
  role: AppUserRole;
  createdAt?: string;
  coins?: number;
  mobile?: string | null;
}

export interface UpdateMyProfilePayload {
  name: string;
  email: string;
  mobile?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export type OtpType = "LOGIN" | "SIGNUP" | "FORGOT_PASSWORD" | "MOBILE_UPDATE";

export const signupUser = async (data: SignupPayload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.auth.signup, data);
  return response.data;
};

export const loginUser = async (data: LoginPayload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.auth.login, data);
  return response.data;
};

export const loginAdminUser = async (data: LoginPayload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.auth.adminLogin, data);
  return response.data;
};

export const fetchCurrentUser = async (): Promise<AuthMeUser> => {
  const response = await axiosInstance.get(API_ENDPOINTS.auth.me);
  return response.data.data as AuthMeUser;
};

export const updateMyProfile = async (
  payload: UpdateMyProfilePayload,
): Promise<AuthMeUser> => {
  const response = await axiosInstance.patch(API_ENDPOINTS.auth.me, payload);
  return response.data.data as AuthMeUser;
};

export const changeMyPassword = async (payload: ChangePasswordPayload): Promise<void> => {
  await axiosInstance.patch(API_ENDPOINTS.auth.password, payload);
};

export const sendOtp = async (payload: { mobile: string; type: OtpType }) => {
  const response = await axiosInstance.post(API_ENDPOINTS.auth.sendOtp, payload);
  return response.data;
};

export const verifyOtp = async (payload: {
  mobile: string;
  otpId: string;
  otp: string;
}) => {
  const response = await axiosInstance.post(API_ENDPOINTS.auth.verifyOtp, payload);
  return response.data;
};

export const forgotPassword = async (payload: { email: string }) => {
  const response = await axiosInstance.post(API_ENDPOINTS.auth.forgotPassword, payload);
  return response.data;
};

export const resetPassword = async (payload: {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  const response = await axiosInstance.post(API_ENDPOINTS.auth.resetPassword, payload);
  return response.data;
};

export const refreshAccessToken = async (payload: { refreshToken: string }) => {
  const response = await axiosInstance.post(API_ENDPOINTS.auth.refresh, payload);
  return response.data;
};

export const updateMobile = async (payload: {
  mobile: string;
  otpId: string;
  otp: string;
}): Promise<AuthMeUser> => {
  const response = await axiosInstance.patch(API_ENDPOINTS.auth.mobile, payload);
  return response.data.data as AuthMeUser;
};

export const deleteMyAccount = async (payload: { password: string }) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.auth.me, { data: payload });
  return response.data;
};
