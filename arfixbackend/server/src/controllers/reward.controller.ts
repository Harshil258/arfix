import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import Reward from "@/models/reward.model";
import Redemption from "@/models/redemption.model";
import User from "@/models/user.model";
import Transaction from "@/models/transaction.model";
import { TransactionType } from "@/types/Transaction";
import { AuthenticatedRequest } from "@/types/User";
import { BadRequestError, NotFoundError, UnauthorizedError } from "@/utils/AppError";
import { sendSuccess } from "@/utils/response";

// GET /api/v1/rewards
export const listRewards = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      page = "1",
      limit = "20",
      category,
    } = req.query as { page?: string; limit?: string; category?: string };

    const filter: Record<string, unknown> = { isActive: true };
    if (category) filter.category = category;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [rewards, total, categories] = await Promise.all([
      Reward.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Reward.countDocuments(filter),
      Reward.distinct("category", { isActive: true }),
    ]);

    sendSuccess(res, 200, "Rewards catalog fetched successfully.", {
      rewards: rewards.map((r) => ({
        id: String(r._id),
        title: r.title,
        description: r.description,
        coinsRequired: r.coinsRequired,
        category: r.category,
        image: r.image,
        stock: r.stock,
        isActive: r.isActive,
        expiresAt: r.expiresAt,
      })),
      categories,
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

// POST /api/v1/rewards/:rewardId/redeem
export const redeemReward = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user?.id;
    if (!userId) throw UnauthorizedError("Not authenticated.");

    const { rewardId } = req.params;
    const { upiId } = req.body as { upiId?: string };

    const reward = await Reward.findById(rewardId).session(session);
    if (!reward || !reward.isActive) {
      throw NotFoundError("Reward not found.");
    }

    if (reward.expiresAt && reward.expiresAt < new Date()) {
      throw BadRequestError("This reward has expired.");
    }

    if (reward.stock <= 0) {
      throw BadRequestError("This reward is out of stock");
    }

    const user = await User.findById(userId).session(session);
    if (!user) throw NotFoundError("User not found.");

    if (user.coins < reward.coinsRequired) {
      throw BadRequestError(
        `Insufficient coins. You need ${reward.coinsRequired} but have ${user.coins}.`,
      );
    }

    if (reward.category === "CASHBACK" && !upiId?.trim()) {
      throw BadRequestError("UPI ID is required for cashback rewards.");
    }

    user.coins -= reward.coinsRequired;
    reward.stock -= 1;

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 2);

    const [redemption] = await Redemption.create(
      [
        {
          user: user._id,
          reward: reward._id,
          rewardTitle: reward.title,
          coinsSpent: reward.coinsRequired,
          status: "PROCESSING",
          upiId: upiId?.trim() ?? null,
          estimatedDelivery,
        },
      ],
      { session },
    );

    await Transaction.create(
      [
        {
          user: user._id,
          amount: reward.coinsRequired,
          type: TransactionType.DEBIT,
          description: `Reward Redeemed — ${reward.title}`,
        },
      ],
      { session },
    );

    await user.save({ session });
    await reward.save({ session });
    await session.commitTransaction();

    sendSuccess(res, 200, "Reward redeemed successfully", {
      redemption: {
        id: String(redemption._id),
        rewardTitle: redemption.rewardTitle,
        coinsSpent: redemption.coinsSpent,
        status: redemption.status,
        estimatedDelivery: redemption.estimatedDelivery,
        createdAt: redemption.createdAt,
      },
      newBalance: user.coins,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// GET /api/v1/rewards/redemptions
export const listMyRedemptions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw UnauthorizedError("Not authenticated.");

    const { page = "1", limit = "20" } = req.query as {
      page?: string;
      limit?: string;
    };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = { user: userId };
    const [redemptions, total] = await Promise.all([
      Redemption.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Redemption.countDocuments(filter),
    ]);

    sendSuccess(res, 200, "Redemptions fetched successfully.", {
      redemptions: redemptions.map((r) => ({
        id: String(r._id),
        rewardTitle: r.rewardTitle,
        coinsSpent: r.coinsSpent,
        status: r.status,
        createdAt: r.createdAt,
        completedAt: r.completedAt ?? null,
      })),
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
