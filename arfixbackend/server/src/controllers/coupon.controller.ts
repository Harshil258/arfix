import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Coupon from "@/models/coupon.model";
import CouponSession from "@/models/couponSession.model";
import User from "@/models/user.model";
import { generateUniqueCodes } from "@/utils/couponCode";
import { sendSuccess } from "@/utils/response";
import { BadRequestError, NotFoundError } from "@/utils/AppError";
import {
  CreateCouponsInput,
  ScanCouponInput,
  InactivateCouponsInput,
  UpdateCouponInput,
  CouponStatus,
  ICoupon,
  CouponQRPayload,
} from "@/types/Coupon";
import { AuthenticatedRequest } from "@/types/User";
import Transaction from "@/models/transaction.model";
import { TransactionType } from "@/types/Transaction";
import { generateCouponsPDF } from "@/utils/pdfGenerator";
import { decrypt } from "@/utils/encryption";

// ─────────────────────────────────────────────────────────────────────────────
// 1. POST /api/v1/coupons/create
//    Body: { quantity: number, price: number }
//    Auth: required (creator = req.user.id)
// ─────────────────────────────────────────────────────────────────────────────
export const createCoupons = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // Start a Mongoose session so coupons + session are written atomically
  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();

  try {
    const { quantity, price } = req.body as CreateCouponsInput;
    const creatorId = req.user?.id;

    if (!creatorId) {
      throw BadRequestError("Authenticated user not found in request.");
    }

    // 1a. Generate unique codes for this batch
    const codes = generateUniqueCodes(quantity);

    // 1b. Bulk-insert all coupons in one DB round-trip
    const couponDocs = codes.map((code) => ({ code, price }));
    const createdCoupons = await Coupon.insertMany(couponDocs, {
      session: dbSession,
    });

    const couponIds = createdCoupons.map((c) => c._id);

    // 1c. Persist the session record
    const [couponSession] = await CouponSession.create(
      [
        {
          coupons: couponIds,
          price,
          quantity,
          createdBy: creatorId,
        },
      ],
      { session: dbSession },
    );

    await dbSession.commitTransaction();

    sendSuccess(res, 201, `${quantity} coupon(s) created successfully.`, {
      session: {
        id: couponSession._id,
        quantity: couponSession.quantity,
        price: couponSession.price,
        createdBy: couponSession.createdBy,
        createdAt: couponSession.createdAt,
      },
      coupons: createdCoupons.map((c) => ({
        id: c._id,
        code: c.code,
        price: c.price,
        status: c.status,
      })),
    });
  } catch (error) {
    await dbSession.abortTransaction();
    next(error);
  } finally {
    await dbSession.endSession();
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 1b. GET /api/v1/coupons/sessions
// ─────────────────────────────────────────────────────────────────────────────
export const listCouponSessions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      page = "1",
      limit = "10",
      sortBy = "createdAt",
      order = "desc",
    } = req.query as {
      page?: string;
      limit?: string;
      sortBy?: string;
      order?: string;
    };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === "asc" ? 1 : -1;
    const sortField = sortBy === "createdAt" ? "createdAt" : "createdAt";

    const [sessions, total] = await Promise.all([
      CouponSession.find()
        .populate("createdBy", "name email")
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      CouponSession.countDocuments(),
    ]);

    const payload = sessions.map((s) => {
      const created = s.createdBy as
        | { _id: unknown; name?: string; email?: string }
        | null
        | undefined;
      return {
        id: String(s._id),
        quantity: s.quantity,
        price: s.price,
        couponCount: Array.isArray(s.coupons) ? s.coupons.length : 0,
        createdAt: s.createdAt,
        createdBy: created
          ? {
              id: String(created._id),
              name: created.name ?? "",
              email: created.email ?? "",
            }
          : null,
      };
    });

    sendSuccess(res, 200, "Coupon sessions retrieved successfully.", {
      sessions: payload,
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

// ─────────────────────────────────────────────────────────────────────────────
// 1c. GET /api/v1/coupons/history
// ─────────────────────────────────────────────────────────────────────────────
export const getScanHistory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw BadRequestError("Authenticated user not found in request.");
    }

    const { page = "1", limit = "20" } = req.query as {
      page?: string;
      limit?: string;
    };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = { scannedBy: userId, status: CouponStatus.SCANNED };

    const [coupons, total, summaryAgg] = await Promise.all([
      Coupon.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limitNum).lean(),
      Coupon.countDocuments(filter),
      Coupon.aggregate([
        { $match: { scannedBy: new mongoose.Types.ObjectId(userId), status: CouponStatus.SCANNED } },
        {
          $group: {
            _id: null,
            totalScans: { $sum: 1 },
            totalCoinsEarned: { $sum: "$price" },
          },
        },
      ]),
    ]);

    const scans = coupons.map((c) => ({
      id: String(c._id),
      couponCode: c.code,
      coinsEarned: c.price,
      productName: null,
      productImage: null,
      scannedAt: c.updatedAt,
    }));

    sendSuccess(res, 200, "Scan history fetched successfully.", {
      scans,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1,
      },
      summary: {
        totalScans: summaryAgg[0]?.totalScans ?? 0,
        totalCoinsEarned: summaryAgg[0]?.totalCoinsEarned ?? 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. POST /api/v1/coupons/scan
//    Body: { code: string, id: string, userId: string }
// ─────────────────────────────────────────────────────────────────────────────
export const scanCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();

  try {
    const { code, id, userId } = req.body as ScanCouponInput;

    // 2a. Find the coupon by both id AND code (double-checks both match)
    const coupon = await Coupon.findOne({
      _id: id,
      code: code.toUpperCase(),
    }).session(dbSession);

    if (!coupon) {
      throw NotFoundError("Invalid coupon code");
    }

    // 2b. Validate coupon status
    if (coupon.status === CouponStatus.SCANNED) {
      throw BadRequestError("This coupon has already been scanned");
    }

    if (coupon.status === CouponStatus.INACTIVE) {
      throw BadRequestError("This coupon is no longer active");
    }

    // 2c. Confirm the user exists
    const user = await User.findById(userId).session(dbSession);
    if (!user) {
      throw NotFoundError("User not found.");
    }

    // 2d. Mark coupon as scanned
    coupon.status = CouponStatus.SCANNED;
    coupon.scannedBy = user._id;
    await coupon.save({ session: dbSession });

    // 2e. Credit the coupon's price as coins to the user
    user.coins += coupon.price;
    await user.save({ session: dbSession });

    await Transaction.create(
      [
        {
          user: user._id,
          amount: coupon.price,
          type: TransactionType.CREDIT,
          description: `QR Scan — ${coupon.code}`,
        },
      ],
      { session: dbSession },
    );

    await dbSession.commitTransaction();

    const response = {
      coupon: {
        id: coupon._id,
        code: coupon.code,
        price: coupon.price,
        status: coupon.status,
        scannedBy: coupon.scannedBy,
      },
      user: {
        id: user._id,
        name: user.name,
        coins: user.coins,
      },
    };

    sendSuccess(res, 200, "Coupon redeemed successfully", response);
  } catch (error) {
    await dbSession.abortTransaction();
    next(error);
  } finally {
    await dbSession.endSession();
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. PATCH /api/v1/coupons/inactivate
//    Body: { ids: string[], isMultiple: boolean }
// ─────────────────────────────────────────────────────────────────────────────
export const inactivateCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { ids, isMultiple } = req.body as InactivateCouponsInput;

    // isMultiple is a signal from FE — when false, enforce exactly one id
    if (!isMultiple && ids.length !== 1) {
      throw BadRequestError(
        "Provide exactly one coupon ID when isMultiple is false.",
      );
    }

    const result = await Coupon.updateMany(
      {
        _id: { $in: ids },
        // Only inactivate ACTIVE coupons (scanned coupons are immutable)
        status: CouponStatus.ACTIVE,
      },
      { $set: { status: CouponStatus.INACTIVE } },
    );

    sendSuccess(res, 200, "Coupon(s) inactivated successfully.", {
      matched: result.matchedCount,
      modified: result.modifiedCount,
      skipped: ids.length - result.matchedCount, // already scanned/inactive
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. PATCH /api/v1/coupons/:id
//    Body: { code?, price?, status? }
// ─────────────────────────────────────────────────────────────────────────────
export const updateCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body as UpdateCouponInput;

    // Guard: scanned coupons are immutable
    const existing = await Coupon.findById(id);
    if (!existing) {
      throw NotFoundError("Coupon not found.");
    }
    if (existing.status === CouponStatus.SCANNED) {
      throw BadRequestError("Scanned coupons cannot be modified.");
    }

    // Uppercase code if provided
    if (updates.code) {
      updates.code = updates.code.toUpperCase();
    }

    const updated = await Coupon.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    sendSuccess(res, 200, "Coupon updated successfully.", { coupon: updated });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. GET /api/v1/coupons/session/:sessionId/pdf
// ─────────────────────────────────────────────────────────────────────────────
export const generateCouponPDF = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { sessionId } = req.params;

    // Step 1 — load session and populate coupons
    const session = await CouponSession.findById(sessionId).populate<{
      coupons: ICoupon[];
    }>("coupons");

    if (!session) throw NotFoundError("Coupon session not found.");
    if (!session.coupons || session.coupons.length === 0) {
      throw BadRequestError("This session has no coupons.");
    }

    // Steps 2 & 3 — decrypt code + id, build payload per coupon
    const payloads: CouponQRPayload[] = session.coupons.map((coupon) => {
      let decryptedCode: string;
      let decryptedId: string;

      try {
        decryptedCode = decrypt(coupon.code);
        decryptedId = decrypt(coupon._id.toString());
      } catch {
        // Stored as plaintext — use as-is
        decryptedCode = coupon.code;
        decryptedId = coupon._id.toString();
      }

      return {
        couponId: decryptedId,
        code: decryptedCode,
        // price: coupon.price,
        status: coupon.status,
      };
    });

    // Steps 4 & 5 — generate PDF with one QR per coupon
    const pdfStream = await generateCouponsPDF(payloads);

    // Step 6 — stream as file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="coupons-session-${sessionId}.pdf"`,
    );
    res.setHeader("Cache-Control", "no-cache");

    pdfStream.pipe(res);
    pdfStream.on("error", (err: Error) => next(err));
  } catch (error) {
    next(error);
  }
};
