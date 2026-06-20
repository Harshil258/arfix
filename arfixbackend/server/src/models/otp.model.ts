import mongoose, { Model, Schema } from "mongoose";

export type OtpPurpose = "LOGIN" | "SIGNUP" | "FORGOT_PASSWORD" | "MOBILE_UPDATE";

export interface IOtp {
  mobile?: string;
  email?: string;
  otpHash: string;
  purpose: OtpPurpose;
  expiresAt: Date;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    mobile: { type: String, required: false, trim: true, index: true },
    email: { type: String, required: false, trim: true, index: true },
    otpHash: { type: String, required: true, select: false },
    purpose: {
      type: String,
      enum: ["LOGIN", "SIGNUP", "FORGOT_PASSWORD", "MOBILE_UPDATE"],
      required: true,
    },
    expiresAt: { type: Date, required: true, index: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

otpSchema.index({ mobile: 1, email: 1, purpose: 1, createdAt: -1 });

const Otp: Model<IOtp> = mongoose.model<IOtp>("Otp", otpSchema);

export default Otp;
