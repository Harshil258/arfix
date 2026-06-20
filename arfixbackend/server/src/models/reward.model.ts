import mongoose, { Model, Schema } from "mongoose";

export type RewardCategory = "CASHBACK" | "VOUCHER" | "PRODUCT" | "DISCOUNT";

export interface IReward {
  title: string;
  description: string;
  coinsRequired: number;
  category: RewardCategory;
  image: string;
  stock: number;
  isActive: boolean;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const rewardSchema = new Schema<IReward>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    coinsRequired: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["CASHBACK", "VOUCHER", "PRODUCT", "DISCOUNT"],
      required: true,
    },
    image: { type: String, default: "" },
    stock: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

const Reward: Model<IReward> = mongoose.model<IReward>("Reward", rewardSchema);

export default Reward;
