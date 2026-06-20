import { Request, Response, NextFunction } from "express";
import User from "@/models/user.model";
import Campaign from "@/models/campaign.model";
import Banner from "@/models/banner.model";
import Notification from "@/models/notification.model";
import Coupon from "@/models/coupon.model";
import { CouponStatus } from "@/types/Coupon";
import { UserRole } from "@/types/User";
import { AuthenticatedRequest } from "@/types/User";
import { NotFoundError, UnauthorizedError } from "@/utils/AppError";
import { sendSuccess } from "@/utils/response";

const maskName = (name: string): string => {
  if (name.length <= 2) return `${name[0]}***`;
  return `${name[0]}***${name[name.length - 1]}`;
};

// GET /api/v1/leaderboard
export const getLeaderboard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const period = (req.query.period as string) ?? "ALL_TIME";

    const leaders = await User.find({
      role: UserRole.USER,
      isActive: true,
    })
      .sort({ coins: -1 })
      .limit(20)
      .select("name coins")
      .lean();

    const leaderPayload = await Promise.all(
      leaders.map(async (leader, index) => {
        const scans = await Coupon.countDocuments({
          scannedBy: leader._id,
          status: CouponStatus.SCANNED,
        });
        return {
          rank: index + 1,
          name: maskName(leader.name),
          coins: leader.coins,
          scans,
        };
      }),
    );

    let myRank = 0;
    let myCoins = 0;

    if (userId) {
      const me = await User.findById(userId).select("coins");
      if (me) {
        myCoins = me.coins;
        const higherCount = await User.countDocuments({
          role: UserRole.USER,
          isActive: true,
          coins: { $gt: me.coins },
        });
        myRank = higherCount + 1;
      }
    }

    sendSuccess(res, 200, "Leaderboard fetched successfully.", {
      period,
      myRank,
      myCoins,
      leaders: leaderPayload,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/campaigns
export const listCampaigns = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const now = new Date();
    const campaigns = await Campaign.find({
      isActive: true,
      startsAt: { $lte: now },
      endsAt: { $gte: now },
    })
      .sort({ startsAt: 1 })
      .lean();

    sendSuccess(res, 200, "Campaigns fetched successfully.", {
      campaigns: campaigns.map((c) => ({
        id: String(c._id),
        title: c.title,
        description: c.description,
        image: c.image,
        type: c.type,
        multiplier: c.multiplier,
        startsAt: c.startsAt,
        endsAt: c.endsAt,
        isActive: c.isActive,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/banners
export const listBanners = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 }).lean();

    sendSuccess(res, 200, "Banners fetched successfully.", {
      banners: banners.map((b) => ({
        id: String(b._id),
        image: b.image,
        title: b.title,
        actionType: b.actionType,
        actionId: b.actionId,
        order: b.order,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/notifications/register
export const registerFcmToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw UnauthorizedError("Not authenticated.");

    const { fcmToken } = req.body as { fcmToken: string; platform?: string };
    const user = await User.findById(userId);
    if (!user) throw NotFoundError("User not found.");

    const tokens = user.fcmTokens ?? [];
    if (!tokens.includes(fcmToken)) {
      user.fcmTokens = [...tokens, fcmToken];
      await user.save();
    }

    sendSuccess(res, 200, "Token registered");
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/notifications
export const listNotifications = async (
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
    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ ...filter, isRead: false }),
    ]);

    sendSuccess(res, 200, "Notifications fetched successfully.", {
      notifications: notifications.map((n) => ({
        id: String(n._id),
        title: n.title,
        body: n.body,
        type: n.type,
        isRead: n.isRead,
        createdAt: n.createdAt,
        data: n.data ?? {},
      })),
      unreadCount,
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

// PATCH /api/v1/notifications/:id/read
export const markNotificationRead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw UnauthorizedError("Not authenticated.");

    const notification = await Notification.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!notification) throw NotFoundError("Notification not found.");

    notification.isRead = true;
    await notification.save();

    sendSuccess(res, 200, "Notification marked as read");
  } catch (error) {
    next(error);
  }
};
