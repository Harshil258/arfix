import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { ForbiddenError, UnauthorizedError } from "../utils/AppError";
import { AuthenticatedRequest, UserRole } from "../types/User";

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw UnauthorizedError("Access denied. No token provided.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      next(UnauthorizedError("Session expired. Please log in again."));
    } else if (error instanceof Error && error.name === "JsonWebTokenError") {
      next(UnauthorizedError("Invalid token. Please log in again."));
    } else {
      next(error);
    }
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      next(UnauthorizedError("Not authenticated."));
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      next(
        ForbiddenError(
          `Access denied. you don't have permission to perform this action.`,
        ),
      );
      return;
    }
    next();
  };
};
