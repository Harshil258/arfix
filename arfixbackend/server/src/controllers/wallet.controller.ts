import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import Transaction from "@/models/transaction.model";
import Coupon from "@/models/coupon.model";
import User from "@/models/user.model";
import { CouponStatus } from "@/types/Coupon";
import { TransactionType } from "@/types/Transaction";
import { AuthenticatedRequest } from "@/types/User";
import { NotFoundError, UnauthorizedError } from "@/utils/AppError";
import { sendSuccess } from "@/utils/response";

const mapTransactionType = (type: TransactionType): string => {
  if (type === TransactionType.CREDIT) return "EARNED";
  return "REDEEMED";
};

// GET /api/v1/wallet
export const getWalletSummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw UnauthorizedError("Not authenticated.");

    const user = await User.findById(userId).select("coins createdAt");
    if (!user) throw NotFoundError("User not found.");

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const [earnedAgg, redeemedAgg, totalScans] = await Promise.all([
      Transaction.aggregate([
        { $match: { user: userObjectId, type: TransactionType.CREDIT } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate([
        { $match: { user: userObjectId, type: TransactionType.DEBIT } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Coupon.countDocuments({ scannedBy: userObjectId, status: CouponStatus.SCANNED }),
    ]);

    sendSuccess(res, 200, "Wallet summary fetched successfully.", {
      balance: user.coins,
      totalEarned: earnedAgg[0]?.total ?? 0,
      totalRedeemed: redeemedAgg[0]?.total ?? 0,
      totalScans,
      memberSince: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/wallet/transactions
export const getWalletTransactions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw UnauthorizedError("Not authenticated.");

    const {
      page = "1",
      limit = "20",
      type,
    } = req.query as { page?: string; limit?: string; type?: string };

    const filter: Record<string, unknown> = { user: userId };

    if (type === "EARNED") {
      filter.type = TransactionType.CREDIT;
    } else if (type === "REDEEMED") {
      filter.type = TransactionType.DEBIT;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Transaction.countDocuments(filter),
    ]);

    const shaped = transactions.map((txn) => ({
      id: String(txn._id),
      type: mapTransactionType(txn.type as TransactionType),
      coins: txn.type === TransactionType.CREDIT ? txn.amount : -txn.amount,
      title: txn.type === TransactionType.CREDIT ? "Coins Earned" : "Coins Redeemed",
      description: txn.description,
      createdAt: txn.createdAt,
    }));

    sendSuccess(res, 200, "Transaction history fetched successfully.", {
      transactions: shaped,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};
