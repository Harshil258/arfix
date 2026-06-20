import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "@/models/user.model";
import Otp, { OtpPurpose } from "@/models/otp.model";
import { sendMail } from "@/utils/mailer";
import { signToken, signRefreshToken, verifyToken } from "@/utils/jwt";
import { sendSuccess } from "@/utils/response";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/AppError";
import { AuthenticatedRequest, JwtPayload, UserRole } from "@/types/User";

const OTP_EXPIRY_SECONDS = 300;
const OTP_RATE_LIMIT = 5;

const formatAuthUser = (user: {
  _id: unknown;
  name: string;
  email: string;
  role: string;
  coins?: number;
  mobile?: string | null;
  createdAt?: Date;
}) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  coins: user.coins ?? 0,
  mobile: user.mobile ?? null,
  ...(user.createdAt && { createdAt: user.createdAt }),
});

const issueTokens = (user: { _id: unknown; email: string; role: string }) => {
  const payload: JwtPayload = {
    id: String(user._id),
    email: user.email,
    role: user.role as UserRole,
  };
  return {
    accessToken: signToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

const generateOtpCode = (): string =>
  String(Math.floor(100000 + Math.random() * 900000));

// POST /api/v1/auth/send-otp
export const sendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { mobile, type } = req.body as { mobile: string; type: OtpPurpose };
    const normalizedMobile = mobile.replace(/\s+/g, "");

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await Otp.countDocuments({
      mobile: normalizedMobile,
      createdAt: { $gte: oneHourAgo },
    });

    if (recentCount >= OTP_RATE_LIMIT) {
      throw BadRequestError("Too many OTP requests. Please try again later.");
    }

    const otpCode = generateOtpCode();
    const otpHash = await bcrypt.hash(otpCode, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000);

    const record = await Otp.create({
      mobile: normalizedMobile,
      otpHash,
      purpose: type,
      expiresAt,
    });

    const payload: Record<string, unknown> = {
      otpId: `otp_${String(record._id)}`,
      expiresIn: OTP_EXPIRY_SECONDS,
    };

    if (process.env.NODE_ENV === "development") {
      payload.devOtp = otpCode;
    }

    sendSuccess(res, 200, "OTP sent successfully", payload);
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/send-otp-email
export const sendEmailOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, type } = req.body as { email: string; type: OtpPurpose };
    const normalizedEmail = email.trim().toLowerCase();

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await Otp.countDocuments({
      email: normalizedEmail,
      createdAt: { $gte: oneHourAgo },
    });

    if (recentCount >= OTP_RATE_LIMIT) {
      throw BadRequestError("Too many OTP requests. Please try again later.");
    }

    const otpCode = generateOtpCode();
    const otpHash = await bcrypt.hash(otpCode, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000);

    const record = await Otp.create({
      email: normalizedEmail,
      otpHash,
      purpose: type,
      expiresAt,
    });

    const payload: Record<string, unknown> = {
      otpId: `otp_${String(record._id)}`,
      expiresIn: OTP_EXPIRY_SECONDS,
    };

    if (process.env.NODE_ENV === "development") {
      payload.devOtp = otpCode;
    }

    // send OTP email
    await sendMail({
      to: normalizedEmail,
      subject: "Your ARFIX OTP",
      text: `Your OTP is ${otpCode}. It will expire in ${Math.floor(
        OTP_EXPIRY_SECONDS / 60,
      )} minutes. Do not share this code with anyone.`,
      html: `<p>Your OTP is <strong>${otpCode}</strong>.</p><p>It will expire in ${Math.floor(
        OTP_EXPIRY_SECONDS / 60,
      )} minutes.</p>`,
    });

    sendSuccess(res, 200, "OTP sent to email successfully", payload);
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/verify-otp-email
export const verifyEmailOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, otpId, otp } = req.body as {
      email: string;
      otpId: string;
      otp: string;
    };

    const normalizedEmail = email.trim().toLowerCase();
    const recordId = otpId.replace(/^otp_/, "");

    const record = await Otp.findById(recordId).select("+otpHash");
    if (!record || record.email !== normalizedEmail) {
      throw BadRequestError("Invalid OTP request.");
    }

    if (record.expiresAt < new Date()) {
      throw BadRequestError("OTP has expired. Please request a new one.");
    }

    if (!(await bcrypt.compare(otp, record.otpHash))) {
      throw BadRequestError("Invalid OTP.");
    }

    record.verified = true;
    await record.save();

    let user = await User.findOne({ email: normalizedEmail, isActive: true });
    let isNewUser = false;

    if (!user && (record.purpose === "LOGIN" || record.purpose === "SIGNUP")) {
      user = await User.create({
        name: `User ${normalizedEmail.split("@")[0]}`,
        email: normalizedEmail,
        password: crypto.randomBytes(16).toString("hex"),
        role: UserRole.USER,
      });
      isNewUser = true;
    }

    if (!user) {
      throw NotFoundError("No account found for this email.");
    }

    const tokens = issueTokens(user);

    sendSuccess(res, 200, "OTP verified", {
      user: formatAuthUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isNewUser,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/verify-otp
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { mobile, otpId, otp } = req.body as {
      mobile: string;
      otpId: string;
      otp: string;
    };

    const normalizedMobile = mobile.replace(/\s+/g, "");
    const recordId = otpId.replace(/^otp_/, "");

    const record = await Otp.findById(recordId).select("+otpHash");
    if (!record || record.mobile !== normalizedMobile) {
      throw BadRequestError("Invalid OTP request.");
    }

    if (record.expiresAt < new Date()) {
      throw BadRequestError("OTP has expired. Please request a new one.");
    }

    if (!(await bcrypt.compare(otp, record.otpHash))) {
      throw BadRequestError("Invalid OTP.");
    }

    record.verified = true;
    await record.save();

    let user = await User.findOne({ mobile: normalizedMobile, isActive: true });
    let isNewUser = false;

    if (!user && (record.purpose === "LOGIN" || record.purpose === "SIGNUP")) {
      const placeholderEmail = `${normalizedMobile}@mobile.arfix.local`;
      user = await User.create({
        name: `User ${normalizedMobile.slice(-4)}`,
        email: placeholderEmail,
        password: crypto.randomBytes(16).toString("hex"),
        mobile: normalizedMobile,
        role: UserRole.USER,
      });
      isNewUser = true;
    }

    if (!user) {
      throw NotFoundError("No account found for this mobile number.");
    }

    if (!user.mobile) {
      user.mobile = normalizedMobile;
      await user.save();
    }

    const tokens = issueTokens(user);

    sendSuccess(res, 200, "OTP verified", {
      user: formatAuthUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      isNewUser,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/google
export const googleSignIn = async (
  _req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  next(BadRequestError("Google sign-in is not configured yet."));
};

// POST /api/v1/auth/forgot-password
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body as { email: string };
    const user = await User.findOne({ email, isActive: true });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save({ validateBeforeSave: false });

      if (process.env.NODE_ENV === "development") {
        sendSuccess(res, 200, "Password reset link sent to email", {
          resetToken,
        });
        return;
      }
    }

    sendSuccess(res, 200, "Password reset link sent to email");
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/reset-password
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { token, newPassword } = req.body as {
      token: string;
      newPassword: string;
    };

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
      isActive: true,
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      throw BadRequestError("Invalid or expired reset token.");
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    sendSuccess(res, 200, "Password reset successful");
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/auth/me
export const deleteMyAccount = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw UnauthorizedError("Not authenticated.");

    const { password } = req.body as { password: string };
    const user = await User.findById(userId).select("+password");
    if (!user) throw NotFoundError("User not found.");

    if (!(await user.comparePassword(password))) {
      throw UnauthorizedError("Password is incorrect.");
    }

    user.isActive = false;
    user.email = `deleted_${String(user._id)}_${user.email}`;
    if (user.mobile) {
      user.mobile = `deleted_${String(user._id)}_${user.mobile}`;
    }
    await user.save({ validateBeforeSave: false });

    sendSuccess(res, 200, "Account deleted successfully");
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/auth/mobile
export const updateMobile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw UnauthorizedError("Not authenticated.");

    const { mobile, otpId, otp } = req.body as {
      mobile: string;
      otpId: string;
      otp: string;
    };

    const normalizedMobile = mobile.replace(/\s+/g, "");
    const recordId = otpId.replace(/^otp_/, "");
    const record = await Otp.findById(recordId).select("+otpHash");

    if (
      !record ||
      record.mobile !== normalizedMobile ||
      record.purpose !== "MOBILE_UPDATE" ||
      record.expiresAt < new Date() ||
      !(await bcrypt.compare(otp, record.otpHash))
    ) {
      throw BadRequestError("Invalid or expired OTP.");
    }

    const taken = await User.findOne({
      mobile: normalizedMobile,
      _id: { $ne: userId },
      isActive: true,
    });
    if (taken) {
      throw ConflictError("This mobile number is already registered.");
    }

    const user = await User.findById(userId);
    if (!user) throw NotFoundError("User not found.");

    user.mobile = normalizedMobile;
    await user.save();

    sendSuccess(res, 200, "Mobile updated successfully", formatAuthUser(user));
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/refresh
export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken } = req.body as { refreshToken: string };
    if (!refreshToken) {
      throw BadRequestError("Refresh token is required.");
    }

    const decoded = verifyToken(refreshToken);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      throw UnauthorizedError("User no longer exists.");
    }

    const tokens = issueTokens(user);
    sendSuccess(res, 200, "Token refreshed successfully", tokens);
  } catch (error) {
    next(error);
  }
};
