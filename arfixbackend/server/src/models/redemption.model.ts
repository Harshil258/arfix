import mongoose, { Model, Schema, Types } from "mongoose";

export type RedemptionStatus = "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface IRedemption {
  user: Types.ObjectId;
  reward: Types.ObjectId;
  rewardTitle: string;
  coinsSpent: number;
  status: RedemptionStatus;
  upiId?: string | null;
  estimatedDelivery?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const redemptionSchema = new Schema<IRedemption>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    reward: { type: Schema.Types.ObjectId, ref: "Reward", required: true },
    rewardTitle: { type: String, required: true },
    coinsSpent: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["PROCESSING", "COMPLETED", "FAILED", "CANCELLED"],
      default: "PROCESSING",
    },
    upiId: { type: String, default: null },
    estimatedDelivery: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

const Redemption: Model<IRedemption> = mongoose.model<IRedemption>(
  "Redemption",
  redemptionSchema,
);

export default Redemption;
