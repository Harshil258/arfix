import { axiosInstance } from "@/lib/axios";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface AppConfig {
  minAppVersion: string;
  latestVersion: string;
  forceUpdate: boolean;
  maintenanceMode: boolean;
  supportEmail: string;
  supportPhone: string;
  privacyPolicyUrl: string;
  termsUrl: string;
  socialLinks: {
    instagram: string;
    youtube: string;
  };
}

export const getAppConfig = async (): Promise<AppConfig> => {
  const response = await axiosInstance.get(API_ENDPOINTS.config);
  return response.data.data as AppConfig;
};
