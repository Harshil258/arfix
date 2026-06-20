import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { signToken } from "../utils/jwt";
import { sendSuccess } from "../utils/response";
import { ConflictError, UnauthorizedError } from "../utils/AppError";
import { AuthenticatedRequest, JwtPayload, UserRole } from "../types/User";

// ─── POST /api/v1/auth/signup ─────────────────────────────────────────────────
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, mobile, password } = req.body as {
      name: string;
      email: string;
      mobile: string;
      password: string;
    };

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        throw ConflictError("An account with this email already exists.");
      }
      if (existingUser.mobile === mobile.trim()) {
        throw ConflictError("An account with this mobile number already exists.");
      }
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create({ name, email, mobile, password });

    // Sign token
    const payload: JwtPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    };
    const accessToken = signToken(payload);

    sendSuccess(res, 201, "Account created successfully.", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        createdAt: user.createdAt,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/v1/auth/login ──────────────────────────────────────────────────
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    // Fetch user with password field (excluded by default)
    const user = await User.findOne({ email, isActive: true }).select(
      "+password",
    );

    if (!user || !(await user.comparePassword(password))) {
      throw UnauthorizedError("Invalid email or password.");
    }

    if (user.role !== UserRole.USER) {
      throw UnauthorizedError(
        "This sign-in is for customer accounts only. Use the staff sign-in page for administrator or staff access.",
      );
    }

    // Sign token
    const payload: JwtPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    };
    const accessToken = signToken(payload);

    sendSuccess(res, 200, "Logged in successfully.", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/v1/auth/admin/login ────────────────────────────────────────────
export const adminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email, isActive: true }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      throw UnauthorizedError("Invalid email or password.");
    }

    if (user.role !== UserRole.ADMIN && user.role !== UserRole.STAFF) {
      throw UnauthorizedError(
        "This sign-in is for staff and administrators only. Use the customer sign-in page for user accounts.",
      );
    }

    const payload: JwtPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    };
    const accessToken = signToken(payload);

    sendSuccess(res, 200, "Logged in successfully.", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/v1/auth/me ──────────────────────────────────────────────────────
export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      throw UnauthorizedError("User no longer exists.");
    }

    sendSuccess(res, 200, "User profile fetched.", {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      coins: user.coins,
      mobile: user.mobile ?? null,
    });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/v1/auth/me ─────────────────────────────────────────────────────
export const updateMyProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw UnauthorizedError("Not authenticated.");
    }

    const { name, email, mobile } = req.body as {
      name: string;
      email?: string;
      mobile?: string;
    };

    const user = await User.findById(userId);
    if (!user) {
      throw UnauthorizedError("User no longer exists.");
    }

    const isEndUser = user.role === UserRole.USER;

    if (isEndUser) {
      user.name = name;
      if (mobile !== undefined && mobile.trim() !== "") {
        const taken = await User.findOne({ mobile: mobile.trim(), _id: { $ne: user._id } });
        if (taken) {
          throw ConflictError("An account with this mobile number already exists.");
        }
        user.mobile = mobile.trim();
      }
    } else {
      if (email !== undefined && email.trim() !== "" && email !== user.email) {
        const taken = await User.findOne({ email, _id: { $ne: user._id } });
        if (taken) {
          throw ConflictError("An account with this email already exists.");
        }
        user.email = email;
      }

      user.name = name;

      if (Object.prototype.hasOwnProperty.call(req.body, "mobile")) {
        const raw = typeof mobile === "string" ? mobile.trim() : "";
        user.mobile = raw === "" ? null : raw;
      }
    }

    await user.save();

    sendSuccess(res, 200, "Profile updated successfully.", {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      coins: user.coins,
      mobile: user.mobile ?? null,
    });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/v1/auth/password ─────────────────────────────────────────────
export const changeMyPassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw UnauthorizedError("Not authenticated.");
    }

    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };

    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw UnauthorizedError("User no longer exists.");
    }

    if (!(await user.comparePassword(currentPassword))) {
      throw UnauthorizedError("Current password is incorrect.");
    }

    user.password = newPassword;
    await user.save();

    sendSuccess(res, 200, "Password changed successfully.", {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};
