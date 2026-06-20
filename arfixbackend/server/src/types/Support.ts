import { Types } from "mongoose";

export enum SupportMessageStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export interface ISupportMessage {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  subject: string;
  message: string;
  status: SupportMessageStatus;
  isReadByStaff: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSupportMessageInput {
  subject: string;
  message: string;
}

export interface UpdateSupportMessageInput {
  status?: SupportMessageStatus;
  isReadByStaff?: boolean;
}
