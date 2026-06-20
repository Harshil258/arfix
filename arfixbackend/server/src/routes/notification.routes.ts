import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import {
  registerFcmToken,
  listNotifications,
  markNotificationRead,
} from "@/controllers/misc.controller";
import { AuthenticatedRequest } from "@/types/User";
import { notificationIdParamValidator } from "@/validators/auth.extended.validator";
import { body } from "express-validator";

const router = Router();

router.use(authenticate);

router.post(
  "/register",
  body("fcmToken").trim().notEmpty().withMessage("fcmToken is required"),
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    registerFcmToken(req as AuthenticatedRequest, res, next),
);

router.get("/", listNotifications);

router.patch(
  "/:id/read",
  notificationIdParamValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    markNotificationRead(req as AuthenticatedRequest, res, next),
);

export default router;
