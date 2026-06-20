import { IWithdrawal, WithdrawalStatus } from "@/types/Withdrawal";
import mongoose, { Model, Schema } from "mongoose";

const withdrawalSchema = new Schema<IWithdrawal>(
  {
    user: {
      type:     Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    amount: {
      type:     Number,
      required: [true, "Amount is required."],
      min:      [100, "Minimum withdrawal amount is ₹100."],
      max:      [100000, "Maximum withdrawal amount is ₹1,00,000."],
    },
    status: {
      type:    String,
      enum:    Object.values(WithdrawalStatus),
      default: WithdrawalStatus.PENDING,
    },
    bankDetails: {
      accountHolderName: {
        type:     String,
        required: [true, "Account holder name is required."],
        trim:     true,
      },
      accountNumber: {
        type:     String,
        required: [true, "Account number is required."],
        trim:     true,
        match:    [/^\d{9,18}$/, "Account number must be 9–18 digits."],
      },
      ifscCode: {
        type:      String,
        required:  [true, "IFSC code is required."],
        trim:      true,
        uppercase: true,
        match:     [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format (e.g. HDFC0001234)."],
      },
      // Optional — for display purposes only, not sent to Razorpay
      bankName: {
        type:    String,
        trim:    true,
        default: null,
      },
    },
    razorpayPayoutId: {
      type:    String,
      default: null,
    },
    rejectionReason: {
      type:    String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
withdrawalSchema.index({ user: 1 });
withdrawalSchema.index({ status: 1 });
withdrawalSchema.index({ createdAt: -1 });
withdrawalSchema.index({ user: 1, status: 1 });
// sparse — only indexes documents that have a payoutId (avoids null conflicts)
withdrawalSchema.index({ razorpayPayoutId: 1 }, { sparse: true });

const Withdrawal: Model<IWithdrawal> = mongoose.model<IWithdrawal>(
  "Withdrawal",
  withdrawalSchema,
);

export default Withdrawal;