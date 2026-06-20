import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import axios from "axios";
import Withdrawal from "@/models/withdrawal.model";
import User from "@/models/user.model";
import Transaction from "@/models/transaction.model";
import {
  WithdrawalRequestInput,
  WithdrawalStatus,
  WithdrawalQueryParams,
} from "@/types/Withdrawal";
import { AuthenticatedRequest } from "@/types/User";
import { BadRequestError, NotFoundError } from "@/utils/AppError";
import { sendSuccess } from "@/utils/response";

// ─────────────────────────────────────────────────────────────────────────────
// RazorpayX axios client
// Uses Basic Auth — no SDK needed for Payouts API
// ─────────────────────────────────────────────────────────────────────────────
const razorpayX = axios.create({
  baseURL: "https://api.razorpay.com/v1",
  auth: {
    username: process.env.RAZORPAY_KEY_ID!,
    password: process.env.RAZORPAY_KEY_SECRET!,
  },
  headers: { "Content-Type": "application/json" },
});

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — Full RazorpayX payout flow
// Step 1: Create Contact → Step 2: Create Fund Account → Step 3: Create Payout
// ─────────────────────────────────────────────────────────────────────────────
const initiateRazorpayPayout = async (opts: {
  userId:            string;
  userName:          string;
  userEmail:         string;
  userMobile?:       string;
  withdrawalId:      string;
  amountInr:         number;
  bankDetails: {
    accountHolderName: string;
    accountNumber:     string;
    ifscCode:          string;
    bankName?:         string;
  };
}): Promise<{ payoutId: string; status: string }> => {
  const accountNumber = process.env.RAZORPAY_ACCOUNT_NUMBER!;

  // Step 1 — Create Contact (represents the user in RazorpayX)
  const { data: contact } = await razorpayX.post("/contacts", {
    name:         opts.userName,
    email:        opts.userEmail,
    contact:      opts.userMobile,
    type:         "customer",
    reference_id: opts.userId,
  });

  // Step 2 — Create Fund Account (attach bank account to contact)
  const { data: fundAccount } = await razorpayX.post("/fund_accounts", {
    contact_id:   contact.id,
    account_type: "bank_account",
    bank_account: {
      name:           opts.bankDetails.accountHolderName,
      ifsc:           opts.bankDetails.ifscCode,
      account_number: opts.bankDetails.accountNumber,
    },
  });

  // Step 3 — Create Payout (trigger actual money transfer)
  const { data: payout } = await razorpayX.post("/payouts", {
    account_number:       accountNumber,
    fund_account_id:      fundAccount.id,
    amount:               opts.amountInr * 100, // INR → paise
    currency:             "INR",
    mode:                 "NEFT",
    purpose:              "payout",
    queue_if_low_balance: true,
    reference_id:         opts.withdrawalId,
    narration:            `Withdrawal #${opts.withdrawalId}`,
  });

  return { payoutId: payout.id, status: payout.status };
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. POST /api/v1/withdrawals
//    User requests withdrawal of coins/money
// ─────────────────────────────────────────────────────────────────────────────
export const requestWithdrawal = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { amount, bankDetails } = req.body as WithdrawalRequestInput;

    // ── Verify user exists ──────────────────────────────────────────────────
    const user = await User.findById(userId);
    if (!user) throw NotFoundError("User not found.");

    // ── Check sufficient coins ──────────────────────────────────────────────
    if (user.coins < amount) {
      throw BadRequestError(
        `Insufficient coins. You have ${user.coins} coins but requested ${amount}.`,
      );
    }

    // ── Block duplicate pending/approved request ────────────────────────────
    const existingWithdrawal = await Withdrawal.findOne({
      user:   userId,
      status: { $in: [WithdrawalStatus.PENDING, WithdrawalStatus.APPROVED] },
    });

    if (existingWithdrawal) {
      throw BadRequestError(
        "You already have a pending or approved withdrawal request. Please wait for it to be processed.",
      );
    }

    // ── Create withdrawal request ───────────────────────────────────────────
    const withdrawal = await Withdrawal.create({
      user: userId,
      amount,
      bankDetails,
      status: WithdrawalStatus.PENDING,
    });

    await withdrawal.populate("user", "name email coins mobile");

    sendSuccess(res, 201, "Withdrawal request created successfully.", { withdrawal });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. GET /api/v1/withdrawals/pending-count
//    Admin — counts grouped by status
// ─────────────────────────────────────────────────────────────────────────────
export const getPendingWithdrawalCount = async (
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const [pendingCount, approvedCount, rejectedCount, completedCount] =
      await Promise.all([
        Withdrawal.countDocuments({ status: WithdrawalStatus.PENDING }),
        Withdrawal.countDocuments({ status: WithdrawalStatus.APPROVED }),
        Withdrawal.countDocuments({ status: WithdrawalStatus.REJECTED }),
        Withdrawal.countDocuments({ status: WithdrawalStatus.COMPLETED }),
      ]);

    sendSuccess(res, 200, "Withdrawal counts retrieved successfully.", {
      pending:   pendingCount,
      approved:  approvedCount,
      rejected:  rejectedCount,
      completed: completedCount,
      total:     pendingCount + approvedCount + rejectedCount + completedCount,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. GET /api/v1/withdrawals/:userId/status
//    Get latest withdrawal status for a user
//    Returns rejectionReason if rejected, razorpayPayoutId if completed
// ─────────────────────────────────────────────────────────────────────────────
export const getWithdrawalStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) throw NotFoundError("User not found.");

    const withdrawal = await Withdrawal.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email coins");

    if (!withdrawal) throw NotFoundError("No withdrawal request found for this user.");

    sendSuccess(res, 200, "Withdrawal status retrieved successfully.", {
      withdrawal: {
        _id:    withdrawal._id,
        status: withdrawal.status,
        amount: withdrawal.amount,
        bankDetails: {
          accountHolderName: withdrawal.bankDetails.accountHolderName,
          bankName:          withdrawal.bankDetails.bankName,
          ifscCode:          withdrawal.bankDetails.ifscCode,
        },
        // Only expose rejection reason when rejected
        rejectionReason:
          withdrawal.status === WithdrawalStatus.REJECTED
            ? withdrawal.rejectionReason
            : null,
        // Only expose payout id when completed
        razorpayPayoutId:
          withdrawal.status === WithdrawalStatus.COMPLETED
            ? withdrawal.razorpayPayoutId
            : null,
        createdAt: withdrawal.createdAt,
        updatedAt: withdrawal.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. GET /api/v1/withdrawals
//    Admin — all withdrawal requests with filters + pagination
// ─────────────────────────────────────────────────────────────────────────────
export const getAllWithdrawals = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      page = "1",
      limit = "10",
      status,
      startDate,
      endDate,
    } = req.query as WithdrawalQueryParams;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {
        ...(startDate && { $gte: new Date(startDate) }),
        ...(endDate   && { $lte: new Date(endDate) }),
      };
    }

    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const [withdrawals, total] = await Promise.all([
      Withdrawal.find(filter)
        .populate("user", "name email mobile coins")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Withdrawal.countDocuments(filter),
    ]);

    sendSuccess(res, 200, "Withdrawals retrieved successfully.", {
      withdrawals,
      pagination: {
        currentPage:    pageNum,
        totalPages:     Math.ceil(total / limitNum),
        totalRecords:   total,
        recordsPerPage: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. PATCH /api/v1/withdrawals/:withdrawalId/approve
//    Admin approves withdrawal → triggers RazorpayX payout → deducts coins
// ─────────────────────────────────────────────────────────────────────────────
export const approveWithdrawal = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { withdrawalId } = req.params;

    const withdrawal = await Withdrawal.findById(withdrawalId).populate<{
      user: {
        _id:     mongoose.Types.ObjectId;
        name:    string;
        email:   string;
        mobile?: string;
        coins:   number;
        save:    () => Promise<void>;
      };
    }>("user");

    if (!withdrawal) throw NotFoundError("Withdrawal request not found.");

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw BadRequestError(
        `Cannot approve withdrawal. Current status is "${withdrawal.status}".`,
      );
    }

    const user = withdrawal.user;

    // ── Re-check coins at approval time ────────────────────────────────────
    if (user.coins < withdrawal.amount) {
      throw BadRequestError(
        "User no longer has sufficient coins for this withdrawal.",
      );
    }

    // ── Trigger RazorpayX payout ────────────────────────────────────────────
    let payoutId: string;
    let payoutStatus: string;

    try {
      const result = await initiateRazorpayPayout({
        userId:       user._id.toString(),
        userName:     user.name,
        userEmail:    user.email,
        userMobile:   user.mobile,
        withdrawalId: withdrawal._id.toString(),
        amountInr:    withdrawal.amount,
        bankDetails:  withdrawal.bankDetails,
      });

      payoutId     = result.payoutId;
      payoutStatus = result.status;
    } catch (payoutError: any) {
      // Extract Razorpay's error description if available
      const razorpayMsg =
        payoutError?.response?.data?.error?.description ??
        payoutError?.message ??
        "Unknown Razorpay error.";

      throw BadRequestError(
        `Failed to initiate payout: ${razorpayMsg}. Withdrawal request remains pending.`,
      );
    }

    // ── Update withdrawal to APPROVED ───────────────────────────────────────
    withdrawal.status           = WithdrawalStatus.APPROVED;
    withdrawal.razorpayPayoutId = payoutId;
    await withdrawal.save();

    // ── Deduct coins from user ──────────────────────────────────────────────
    user.coins -= withdrawal.amount;
    await user.save();

    // ── Create debit transaction record ────────────────────────────────────
    await Transaction.create({
      user:        user._id,
      amount:      withdrawal.amount,
      type:        "debit",
      description: `Withdrawal approved — ${withdrawal.amount} coins deducted.`,
    });

    await withdrawal.populate("user", "name email coins");

    sendSuccess(res, 200, "Withdrawal approved and payout initiated successfully.", {
      withdrawal,
      razorpayPayoutId: payoutId,
      razorpayStatus:   payoutStatus,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. PATCH /api/v1/withdrawals/:withdrawalId/reject
//    Admin rejects withdrawal with a mandatory reason
//    Coins remain untouched in user's account
// ─────────────────────────────────────────────────────────────────────────────
export const rejectWithdrawal = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { withdrawalId }  = req.params;
    const { rejectionReason } = req.body as { rejectionReason: string };

    if (!rejectionReason?.trim()) {
      throw BadRequestError("A rejection reason is required.");
    }

    const withdrawal = await Withdrawal.findById(withdrawalId).populate("user");
    if (!withdrawal) throw NotFoundError("Withdrawal request not found.");

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw BadRequestError(
        `Cannot reject withdrawal. Current status is "${withdrawal.status}".`,
      );
    }

    withdrawal.status          = WithdrawalStatus.REJECTED;
    withdrawal.rejectionReason = rejectionReason.trim();
    await withdrawal.save();

    await withdrawal.populate("user", "name email coins");

    sendSuccess(res, 200, "Withdrawal rejected successfully.", { withdrawal });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. GET /api/v1/withdrawals/:userId/history
//    Withdrawal history for a specific user with pagination
// ─────────────────────────────────────────────────────────────────────────────
export const getWithdrawalHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { page = "1", limit = "10" } = req.query;

    const user = await User.findById(userId).select("name email coins");
    if (!user) throw NotFoundError("User not found.");

    const pageNum  = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const [withdrawals, total] = await Promise.all([
      Withdrawal.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Withdrawal.countDocuments({ user: userId }),
    ]);

    sendSuccess(res, 200, "Withdrawal history retrieved successfully.", {
      user: {
        name:         user.name,
        email:        user.email,
        currentCoins: user.coins,
      },
      withdrawals,
      pagination: {
        currentPage:    pageNum,
        totalPages:     Math.ceil(total / limitNum),
        totalRecords:   total,
        recordsPerPage: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. POST /api/v1/withdrawals/webhook
//    Razorpay webhook — auto-syncs payout status to COMPLETED or FAILED
//    Register this URL in Razorpay Dashboard → Webhooks
//    Events: payout.processed, payout.failed, payout.reversed
// ─────────────────────────────────────────────────────────────────────────────
export const handleRazorpayWebhook = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const secret    = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const signature = req.headers["x-razorpay-signature"] as string;

    // ── Verify webhook signature ────────────────────────────────────────────
    const crypto        = await import("crypto");
    const expectedSig   = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (signature !== expectedSig) {
      res.status(400).json({ message: "Invalid webhook signature." });
      return;
    }

    const { event, payload } = req.body;
    const payoutEntity = payload?.payout?.entity;

    if (!payoutEntity?.id) {
      res.status(200).json({ message: "Ignored — no payout entity." });
      return;
    }

    const withdrawal = await Withdrawal.findOne({
      razorpayPayoutId: payoutEntity.id,
    });

    if (!withdrawal) {
      res.status(200).json({ message: "Ignored — no matching withdrawal." });
      return;
    }

    // ── Map Razorpay events → our statuses ──────────────────────────────────
    if (event === "payout.processed") {
      withdrawal.status = WithdrawalStatus.COMPLETED;
    } else if (event === "payout.failed" || event === "payout.reversed") {
      withdrawal.status = WithdrawalStatus.REJECTED;
      withdrawal.rejectionReason =
        payoutEntity.failure_reason ?? "Payout failed or reversed by Razorpay.";

      // ── Refund coins back to user on failure ────────────────────────────
      await User.findByIdAndUpdate(withdrawal.user, {
        $inc: { coins: withdrawal.amount },
      });

      await Transaction.create({
        user:        withdrawal.user,
        amount:      withdrawal.amount,
        type:        "credit",
        description: `Withdrawal payout failed — ${withdrawal.amount} coins refunded.`,
      });
    }

    await withdrawal.save();

    res.status(200).json({ message: "Webhook processed." });
  } catch (error) {
    next(error);
  }
};