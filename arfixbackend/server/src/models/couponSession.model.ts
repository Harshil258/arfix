import mongoose, { Schema, Model } from "mongoose";
import { ICouponSession } from "@/types/Coupon";

const couponSessionSchema = new Schema<ICouponSession>(
  {
    coupons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
        required: true,
      },
    ],
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ─── Indexes ─────────────────────────────────────────────────────────────────
couponSessionSchema.index({ createdBy: 1 });
couponSessionSchema.index({ createdAt: -1 });

const CouponSession: Model<ICouponSession> = mongoose.model<ICouponSession>(
  "CouponSession",
  couponSessionSchema,
);

export default CouponSession;
