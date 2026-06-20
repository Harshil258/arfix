import { Types } from "mongoose";
import { IUser } from "./User";

// ─── User ────────────────────────────────────────────────────────────────────

export interface ITransaction {
  _id: Types.ObjectId;
  user: IUser;
  amount: number;
  type: TransactionType;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TransactionType {
  CREDIT = "credit",
  DEBIT = "debit",
}

// ─── Query filters for the history API ───────────────────────────────────────
export interface TransactionHistoryQuery {
  page?: string;
  limit?: string;
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
}
