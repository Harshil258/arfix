import { Request } from "express";
import { Types } from "mongoose";

// ─── User ────────────────────────────────────────────────────────────────────

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  coins: number;
  mobile?: string | null;
  fcmTokens?: string[];
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  STAFF = "staff",
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
}

// ─── Request Extensions ──────────────────────────────────────────────────────

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// ─── Config ──────────────────────────────────────────────────────────────────

export interface AppConfig {
  nodeEnv: string;
  port: number;
  mongoUri: string;
  jwt: {
    secret: string;
    expiresIn: string;
    cookieExpiresIn: number;
  };
  cors: {
    allowedOrigins: string[];
  };
  razorpay: {
    keyId: string;
    keySecret: string;
    accountNumber?: string;
  };
}
