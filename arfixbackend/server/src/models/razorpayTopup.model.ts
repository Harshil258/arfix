import mongoose, { Model, Schema, Types } from "mongoose";

export type RazorpayTopupStatus = "created" | "paid" | "expired" | "cancelled";

export interface IRazorpayTopup {
  createdBy: Types.ObjectId;
  amountInr: number;
  amountPaise: number;
  paymentLinkId: string;
  shortUrl: string;
  status: RazorpayTopupStatus;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const razorpayTopupSchema = new Schema<IRazorpayTopup>(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amountInr: { type: Number, required: true, min: 1 },
    amountPaise: { type: Number, required: true, min: 100 },
    paymentLinkId: { type: String, required: true, unique: true },
    shortUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["created", "paid", "expired", "cancelled"],
      default: "created",
    },
    note: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false },
);

const RazorpayTopup: Model<IRazorpayTopup> = mongoose.model<IRazorpayTopup>(
  "RazorpayTopup",
  razorpayTopupSchema,
);

export default RazorpayTopup;
