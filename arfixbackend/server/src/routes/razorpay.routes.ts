import { Router, Request, Response, NextFunction } from "express";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { UserRole, AuthenticatedRequest } from "@/types/User";
import {
  getRazorpayBalance,
  getRazorpayTransactions,
  createRazorpayTopup,
  listRazorpayTopups,
} from "@/controllers/razorpay.controller";
import {
  createTopupValidator,
  listTransactionsValidator,
} from "@/validators/razorpay.validator";

const router = Router();
const adminOnly = authorize(UserRole.ADMIN);

router.use(authenticate, adminOnly);

router.get("/balance", getRazorpayBalance);

router.get(
  "/transactions",
  listTransactionsValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    getRazorpayTransactions(req as AuthenticatedRequest, res, next),
);

router.post(
  "/topup",
  createTopupValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    createRazorpayTopup(req as AuthenticatedRequest, res, next),
);

router.get("/topups", listRazorpayTopups);

export default router;
