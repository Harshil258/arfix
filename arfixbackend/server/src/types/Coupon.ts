import { Types } from "mongoose";

// ─── Enums ───────────────────────────────────────────────────────────────────

export enum CouponStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SCANNED = "SCANNED",
}

// ─── Coupon ───────────────────────────────────────────────────────────────────

export interface ICoupon {
  _id: Types.ObjectId;
  code: string;
  scannedBy: Types.ObjectId | null;
  status: CouponStatus;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Coupon Session ───────────────────────────────────────────────────────────

export interface ICouponSession {
  _id: Types.ObjectId;
  coupons: Types.ObjectId[]; // refs to Coupon
  price: number; // price per coupon in this session
  quantity: number; // how many were created
  createdBy: Types.ObjectId; // ref to User
  createdAt: Date;
  updatedAt: Date;
}

// ─── Request Bodies ───────────────────────────────────────────────────────────

export interface CreateCouponsInput {
  quantity: number;
  price: number;
}

export interface ScanCouponInput {
  code: string;
  id: string; // coupon _id
  userId: string; // user performing the scan
}

export interface InactivateCouponsInput {
  ids: string[];
  isMultiple: boolean;
}

export interface UpdateCouponInput {
  code?: string;
  price?: number;
  status?: CouponStatus;
}

export interface CouponQRPayload {
  couponId: string;
  code: string;
  status: string;
}
