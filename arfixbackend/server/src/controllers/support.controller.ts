import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import SupportMessage from "@/models/supportMessage.model";
import { sendSuccess } from "@/utils/response";
import { BadRequestError, NotFoundError } from "@/utils/AppError";
import {
  CreateSupportMessageInput,
  SupportMessageStatus,
  UpdateSupportMessageInput,
} from "@/types/Support";
import { AuthenticatedRequest } from "@/types/User";

const toPublic = (
  doc: {
    _id: mongoose.Types.ObjectId;
    user: unknown;
    subject: string;
    message: string;
    status: SupportMessageStatus;
    isReadByStaff: boolean;
    createdAt: Date;
    updatedAt: Date;
  },
  includeBody: boolean,
) => {
  const user = doc.user as
    | { _id: mongoose.Types.ObjectId; name?: string; email?: string }
    | mongoose.Types.ObjectId
    | null
    | undefined;

  let userOut: { id: string; name: string; email: string } | null = null;
  if (user && typeof user === "object" && "_id" in user) {
    userOut = {
      id: String((user as { _id: mongoose.Types.ObjectId })._id),
      name: (user as { name?: string }).name ?? "",
      email: (user as { email?: string }).email ?? "",
    };
  } else if (user) {
    userOut = { id: String(user), name: "", email: "" };
  }

  return {
    id: String(doc._id),
    subject: doc.subject,
    ...(includeBody ? { message: doc.message } : { preview: doc.message.slice(0, 160) }),
    status: doc.status,
    isReadByStaff: doc.isReadByStaff,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    user: userOut,
  };
};

// ─── POST /api/v1/support/messages (mobile + any authenticated user) ─────────
export const createSupportMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw BadRequestError("Authenticated user not found in request.");

    const { subject, message } = req.body as CreateSupportMessageInput;

    const doc = await SupportMessage.create({
      user: userId,
      subject,
      message,
      status: SupportMessageStatus.OPEN,
      isReadByStaff: false,
    });

    const populated = await SupportMessage.findById(doc._id)
      .populate("user", "name email")
      .lean();

    if (!populated) {
      throw NotFoundError("Support message could not be loaded.");
    }

    sendSuccess(res, 201, "Support message submitted successfully.", {
      message: toPublic(populated as Parameters<typeof toPublic>[0], true),
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/v1/support/messages/me (authenticated user — own threads) ───────
export const listMySupportMessages = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw BadRequestError("Authenticated user not found in request.");

    const {
      page = "1",
      limit = "10",
      sortBy = "createdAt",
      order = "desc",
      status,
    } = req.query as {
      page?: string;
      limit?: string;
      sortBy?: string;
      order?: string;
      status?: string;
    };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === "asc" ? 1 : -1;
    const sortField = sortBy === "status" ? "status" : "createdAt";

    const filter: Record<string, unknown> = { user: userId };
    if (status && Object.values(SupportMessageStatus).includes(status as SupportMessageStatus)) {
      filter.status = status;
    }

    const [rows, total] = await Promise.all([
      SupportMessage.find(filter)
        .populate("user", "name email")
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      SupportMessage.countDocuments(filter),
    ]);

    const messages = rows.map((row) =>
      toPublic(row as Parameters<typeof toPublic>[0], false),
    );

    sendSuccess(res, 200, "Support messages retrieved successfully.", {
      messages,
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

// ─── GET /api/v1/support/messages/me/:messageId (authenticated user — one thread) ─
export const getMySupportMessageById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw BadRequestError("Authenticated user not found in request.");

    const { messageId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      throw BadRequestError("Invalid message ID.");
    }

    const doc = await SupportMessage.findOne({
      _id: messageId,
      user: userId,
    })
      .populate("user", "name email")
      .lean();

    if (!doc) throw NotFoundError("Support message not found.");

    sendSuccess(res, 200, "Support message retrieved successfully.", {
      message: toPublic(doc as Parameters<typeof toPublic>[0], true),
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/v1/support/messages (staff / admin) ────────────────────────────
export const listSupportMessages = async (
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
      status,
      unreadOnly,
    } = req.query as {
      page?: string;
      limit?: string;
      sortBy?: string;
      order?: string;
      status?: string;
      unreadOnly?: string;
    };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === "asc" ? 1 : -1;
    const sortField = sortBy === "status" ? "status" : "createdAt";

    const filter: Record<string, unknown> = {};
    if (status && Object.values(SupportMessageStatus).includes(status as SupportMessageStatus)) {
      filter.status = status;
    }
    if (unreadOnly === "true") {
      filter.isReadByStaff = false;
    }
    if (unreadOnly === "false") {
      filter.isReadByStaff = true;
    }

    const [rows, total] = await Promise.all([
      SupportMessage.find(filter)
        .populate("user", "name email")
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      SupportMessage.countDocuments(filter),
    ]);

    const messages = rows.map((row) =>
      toPublic(row as Parameters<typeof toPublic>[0], false),
    );

    sendSuccess(res, 200, "Support messages retrieved successfully.", {
      messages,
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

// ─── GET /api/v1/support/messages/:id (staff / admin) ─────────────────────────
export const getSupportMessageById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw BadRequestError("Invalid message ID.");
    }

    const doc = await SupportMessage.findById(id).populate("user", "name email").lean();
    if (!doc) throw NotFoundError("Support message not found.");

    await SupportMessage.findByIdAndUpdate(id, { $set: { isReadByStaff: true } });

    const withRead = { ...doc, isReadByStaff: true };

    sendSuccess(res, 200, "Support message retrieved successfully.", {
      message: toPublic(withRead as Parameters<typeof toPublic>[0], true),
    });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/v1/support/messages/:id (staff / admin) ───────────────────────
export const updateSupportMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw BadRequestError("Invalid message ID.");
    }

    const body = req.body as UpdateSupportMessageInput;
    const updates: Record<string, unknown> = {};
    if (body.status !== undefined) updates.status = body.status;
    if (typeof body.isReadByStaff === "boolean") updates.isReadByStaff = body.isReadByStaff;

    if (Object.keys(updates).length === 0) {
      throw BadRequestError("No valid fields to update.");
    }

    const doc = await SupportMessage.findByIdAndUpdate(id, { $set: updates }, { new: true })
      .populate("user", "name email")
      .lean();

    if (!doc) throw NotFoundError("Support message not found.");

    sendSuccess(res, 200, "Support message updated successfully.", {
      message: toPublic(doc as Parameters<typeof toPublic>[0], true),
    });
  } catch (error) {
    next(error);
  }
};
