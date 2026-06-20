import { Request, Response, NextFunction } from "express";
import Transaction from "@/models/transaction.model";
import User from "@/models/user.model";
import { TransactionHistoryQuery, TransactionType } from "@/types/Transaction";
import { NotFoundError } from "@/utils/AppError";
import { sendSuccess } from "@/utils/response";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/transactions/:userId/history
//
// Returns paginated transaction history for a user.
// Supports optional filters: type, startDate, endDate
// ─────────────────────────────────────────────────────────────────────────────
export const getTransactionHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const {
      page = "1",
      limit = "10",
      type,
      startDate,
      endDate,
    } = req.query as TransactionHistoryQuery;

    // ── Confirm user exists ─────────────────────────────────────────────────
    const user = await User.findById(userId).select("name email coins");
    if (!user) throw NotFoundError("User not found.");

    // ── Build dynamic filter ────────────────────────────────────────────────
    const filter: Record<string, unknown> = { user: userId };

    if (type) {
      filter["type"] = type;
    }

    if (startDate || endDate) {
      filter["createdAt"] = {
        ...(startDate && { $gte: new Date(startDate) }),
        ...(endDate && { $lte: new Date(endDate) }),
      };
    }

    // ── Pagination ──────────────────────────────────────────────────────────
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // ── Query + count in parallel ───────────────────────────────────────────
    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Transaction.countDocuments(filter),
    ]);

    // ── Summary aggregation (totals per type) ───────────────────────────────
    const summary = await Transaction.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Shape summary into a readable map  { COUPON_SCAN: { total, count }, ... }
    const summaryMap = Object.values(TransactionType).reduce(
      (acc, t) => {
        const found = summary.find((s) => s._id === t);
        acc[t] = {
          totalAmount: found?.totalAmount ?? 0,
          count: found?.count ?? 0,
        };
        return acc;
      },
      {} as Record<TransactionType, { totalAmount: number; count: number }>,
    );

    sendSuccess(res, 200, "Transaction history fetched successfully.", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        coins: user.coins,
      },
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
      transactions,
      summary: summaryMap,
    });
  } catch (error) {
    next(error);
  }
};
