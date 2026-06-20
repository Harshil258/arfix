import { Types } from "mongoose";
import { IUser } from "./User";

export interface IWithdrawal {
  _id: Types.ObjectId;
  user: IUser | Types.ObjectId;
  amount: number;
  status: WithdrawalStatus;
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  razorpayPayoutId?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum WithdrawalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  COMPLETED = "completed",
  FAILED = "failed",
}

// Request/Response Types
export interface WithdrawalRequestInput {
  amount: number;
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
}

export interface WithdrawalApprovalInput {
  approvalReason?: string;
}

export interface WithdrawalRejectionInput {
  rejectionReason: string;
}

export interface WithdrawalQueryParams {
  page?: string;
  limit?: string;
  status?: WithdrawalStatus;
  startDate?: string;
  endDate?: string;
}
