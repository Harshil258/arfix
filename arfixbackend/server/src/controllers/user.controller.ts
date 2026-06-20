import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "@/models/user.model";
import { sendSuccess } from "@/utils/response";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "@/utils/AppError";
import type { IUser } from "@/types/User";
import { AuthenticatedRequest, UserRole } from "@/types/User";

const toPublicUser = (doc: IUser) => ({
  id: doc._id.toString(),
  name: doc.name,
  email: doc.email,
  role: doc.role,
  isActive: doc.isActive,
  coins: doc.coins,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

const assertCanAssignRole = (
  actorRole: UserRole,
  targetRole: UserRole,
): void => {
  if (actorRole === UserRole.ADMIN) return;
  if (actorRole === UserRole.STAFF) {
    if (targetRole === UserRole.ADMIN) {
      throw ForbiddenError("Staff members cannot assign or modify admin users.");
    }
    return;
  }
  throw ForbiddenError("You do not have permission to assign this role.");
};

// ─── GET /api/v1/users ────────────────────────────────────────────────────────
export const getUsers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const currentId = req.user?.id;
    if (!currentId) throw BadRequestError("Authenticated user not found in request.");

    const listType = (req.query.listType as string | undefined) ?? "user";

    const filter: Record<string, unknown> = {
      _id: { $ne: new mongoose.Types.ObjectId(currentId) },
    };

    if (listType === "user") {
      filter.role = UserRole.USER;
    } else {
      filter.role = { $in: [UserRole.ADMIN, UserRole.STAFF] };
    }

    const users = await User.find(filter).sort({ createdAt: -1 }).lean();

    const payload = users.map((u) => ({
      id: String(u._id),
      name: u.name,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      coins: u.coins,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    sendSuccess(res, 200, "Users fetched successfully.", { users: payload });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/v1/users/:id ────────────────────────────────────────────────────
export const getUserById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const actor = req.user;
    if (!actor) throw BadRequestError("Authenticated user not found in request.");

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw BadRequestError("Invalid user ID.");
    }

    const user = await User.findById(id);
    if (!user) throw NotFoundError("User not found.");

    assertCanAssignRole(actor.role, user.role as UserRole);

    sendSuccess(res, 200, "User fetched successfully.", toPublicUser(user));
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/v1/users ───────────────────────────────────────────────────────
export const createUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const actor = req.user;
    if (!actor) throw BadRequestError("Authenticated user not found in request.");

    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: UserRole;
    };

    const role = (req.body.role as UserRole | undefined) ?? UserRole.USER;
    assertCanAssignRole(actor.role, role);

    const existing = await User.findOne({ email });
    if (existing) {
      throw ConflictError("An account with this email already exists.");
    }

    const user = await User.create({ name, email, password, role });
    sendSuccess(res, 201, "User created successfully.", toPublicUser(user));
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/v1/users/:id ──────────────────────────────────────────────────
export const updateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const actor = req.user;
    if (!actor) throw BadRequestError("Authenticated user not found in request.");

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw BadRequestError("Invalid user ID.");
    }

    const user = await User.findById(id);
    if (!user) throw NotFoundError("User not found.");

    if (user._id.toString() === actor.id) {
      throw ForbiddenError("You cannot update your own account from this list.");
    }

    assertCanAssignRole(actor.role, user.role as UserRole);

    const { name, email, password, role, isActive } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
      isActive?: boolean;
    };

    if (role !== undefined && role !== user.role) {
      assertCanAssignRole(actor.role, role);
    }

    if (email !== undefined && email !== user.email) {
      const taken = await User.findOne({ email, _id: { $ne: user._id } });
      if (taken) throw ConflictError("An account with this email already exists.");
      user.email = email;
    }

    if (name !== undefined) user.name = name;
    if (role !== undefined) user.role = role;
    if (typeof isActive === "boolean") user.isActive = isActive;
    if (password !== undefined && password.length > 0) {
      user.password = password;
    }

    await user.save();

    const fresh = await User.findById(user._id);
    if (!fresh) throw NotFoundError("User not found after update.");

    sendSuccess(res, 200, "User updated successfully.", toPublicUser(fresh));
  } catch (error) {
    next(error);
  }
};
