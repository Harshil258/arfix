import { Response, NextFunction } from "express";
import User from "@/models/user.model";
import Product from "@/models/Product.model";
import CouponSession from "@/models/couponSession.model";
import SupportMessage from "@/models/supportMessage.model";
import { sendSuccess } from "@/utils/response";
import { BadRequestError } from "@/utils/AppError";
import { AuthenticatedRequest, UserRole } from "@/types/User";
import { SupportMessageStatus } from "@/types/Support";

// ─── GET /api/v1/dashboard/summary ───────────────────────────────────────────
export const getDashboardSummary = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw BadRequestError("Authenticated user not found in request.");

    const isStaff = req.user?.role === UserRole.ADMIN || req.user?.role === UserRole.STAFF;

    const [endUserCount, productCount, couponSpendAgg] = await Promise.all([
      User.countDocuments({ role: UserRole.USER }),
      Product.countDocuments({ isActive: true, isDeleted: false }),
      CouponSession.aggregate([
        {
          $project: {
            lineTotal: { $multiply: ["$price", "$quantity"] },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$lineTotal" },
          },
        },
      ]),
    ]);

    const couponRow = couponSpendAgg[0] as { total?: number } | undefined;
    const couponSpendTotal =
      couponRow && typeof couponRow.total === "number" ? couponRow.total : 0;

    let endUsersPayload: {
      id: string;
      name: string;
      email: string;
      createdAt: Date;
    }[] = [];

    if (isStaff) {
      const recentEndUsers = await User.find({ role: UserRole.USER })
        .select("name email createdAt")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean();

      endUsersPayload = recentEndUsers.map((u) => ({
        id: String(u._id),
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
      }));
    }

    let recentSupportPayload: {
      id: string;
      subject: string;
      status: SupportMessageStatus;
      isReadByStaff: boolean;
      createdAt: Date;
      user: { name: string; email: string } | null;
    }[] = [];

    if (isStaff) {
      const rows = await SupportMessage.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean();

      recentSupportPayload = rows.map((row) => {
        const u = row.user as { name?: string; email?: string } | null;
        return {
          id: String(row._id),
          subject: row.subject,
          status: row.status as SupportMessageStatus,
          isReadByStaff: row.isReadByStaff,
          createdAt: row.createdAt,
          user: u
            ? { name: u.name ?? "", email: u.email ?? "" }
            : null,
        };
      });
    }

    sendSuccess(res, 200, "Dashboard summary retrieved successfully.", {
      stats: {
        endUserCount,
        productCount,
        couponSpendTotal,
      },
      recentEndUsers: endUsersPayload,
      recentSupport: recentSupportPayload,
    });
  } catch (error) {
    next(error);
  }
};
