import { Router, Request, Response, NextFunction } from "express";
import {
  createSupportMessage,
  listMySupportMessages,
  getMySupportMessageById,
  listSupportMessages,
  getSupportMessageById,
  updateSupportMessage,
} from "@/controllers/support.controller";
import {
  createSupportMessageValidator,
  listMySupportMessagesQueryValidator,
  listSupportMessagesQueryValidator,
  mySupportMessageIdParamValidator,
  supportMessageIdParamValidator,
  updateSupportMessageValidator,
} from "@/validators/support.validator";
import { validate } from "@/middleware/validate.middleware";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { AuthenticatedRequest, UserRole } from "@/types/User";

const router = Router();

const staffOrAdmin = authorize(UserRole.ADMIN, UserRole.STAFF);

// Mobile / app: any authenticated user can submit
router.post(
  "/messages",
  authenticate,
  createSupportMessageValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    createSupportMessage(req as AuthenticatedRequest, res, next),
);

router.get(
  "/messages/me",
  authenticate,
  listMySupportMessagesQueryValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    listMySupportMessages(req as AuthenticatedRequest, res, next),
);

router.get(
  "/messages/me/:messageId",
  authenticate,
  mySupportMessageIdParamValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    getMySupportMessageById(req as AuthenticatedRequest, res, next),
);

router.get(
  "/messages",
  authenticate,
  staffOrAdmin,
  listSupportMessagesQueryValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    listSupportMessages(req as AuthenticatedRequest, res, next),
);

router.get(
  "/messages/:id",
  authenticate,
  staffOrAdmin,
  supportMessageIdParamValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    getSupportMessageById(req as AuthenticatedRequest, res, next),
);

router.patch(
  "/messages/:id",
  authenticate,
  staffOrAdmin,
  updateSupportMessageValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    updateSupportMessage(req as AuthenticatedRequest, res, next),
);

export default router;
