import mongoose, { Schema, Model } from "mongoose";
import { CouponStatus, ICoupon } from "@/types/Coupon";

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    scannedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(CouponStatus),
      default: CouponStatus.ACTIVE,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ─── Indexes ─────────────────────────────────────────────────────────────────
couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ status: 1 });

const Coupon: Model<ICoupon> = mongoose.model<ICoupon>("Coupon", couponSchema);

export default Coupon;
