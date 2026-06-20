import mongoose, { Schema, Model } from "mongoose";
import { ISupportMessage, SupportMessageStatus } from "@/types/Support";

const supportMessageSchema = new Schema<ISupportMessage>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [10000, "Message cannot exceed 10000 characters"],
    },
    status: {
      type: String,
      enum: Object.values(SupportMessageStatus),
      default: SupportMessageStatus.OPEN,
      index: true,
    },
    isReadByStaff: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

supportMessageSchema.index({ createdAt: -1 });
supportMessageSchema.index({ status: 1, createdAt: -1 });

const SupportMessage: Model<ISupportMessage> = mongoose.model<ISupportMessage>(
  "SupportMessage",
  supportMessageSchema,
);

export default SupportMessage;
