import { Router, Request, Response, NextFunction } from "express";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { UserRole, AuthenticatedRequest } from "@/types/User";
import {
  listUsersQueryValidator,
  createUserValidator,
  updateUserValidator,
  userIdParamValidator,
} from "@/validators/user.validator";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
} from "@/controllers/user.controller";

const router = Router();

const adminOnly = authorize(UserRole.ADMIN);

router.get(
  "/",
  authenticate,
  adminOnly,
  listUsersQueryValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    getUsers(req as AuthenticatedRequest, res, next),
);

router.post(
  "/",
  authenticate,
  adminOnly,
  createUserValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    createUser(req as AuthenticatedRequest, res, next),
);

router.get(
  "/:id",
  authenticate,
  adminOnly,
  userIdParamValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    getUserById(req as AuthenticatedRequest, res, next),
);

router.patch(
  "/:id",
  authenticate,
  adminOnly,
  updateUserValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    updateUser(req as AuthenticatedRequest, res, next),
);

export default router;
