import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "@/utils/response";

// GET /api/v1/config
export const getAppConfig = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    sendSuccess(res, 200, "App config fetched successfully.", {
      minAppVersion: process.env.MIN_APP_VERSION ?? "1.0.0",
      latestVersion: process.env.LATEST_APP_VERSION ?? "1.0.0",
      forceUpdate: process.env.FORCE_UPDATE === "true",
      maintenanceMode: process.env.MAINTENANCE_MODE === "true",
      supportEmail: process.env.SUPPORT_EMAIL ?? "support@arfix.com",
      supportPhone: process.env.SUPPORT_PHONE ?? "+91-9876543210",
      privacyPolicyUrl: process.env.PRIVACY_POLICY_URL ?? "https://arfix.com/privacy",
      termsUrl: process.env.TERMS_URL ?? "https://arfix.com/terms",
      socialLinks: {
        instagram: process.env.SOCIAL_INSTAGRAM ?? "https://instagram.com/arfix",
        youtube: process.env.SOCIAL_YOUTUBE ?? "https://youtube.com/@arfix",
      },
    });
  } catch (error) {
    next(error);
  }
};
