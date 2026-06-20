import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { walletTransactionsQueryValidator } from "@/validators/wallet.validator";
import { getWalletSummary, getWalletTransactions } from "@/controllers/wallet.controller";
import { AuthenticatedRequest } from "@/types/User";

const router = Router();

router.use(authenticate);

// GET /api/v1/wallet
router.get("/", (req: Request, res: Response, next: NextFunction) =>
  getWalletSummary(req as AuthenticatedRequest, res, next),
);

// GET /api/v1/wallet/transactions
router.get(
  "/transactions",
  walletTransactionsQueryValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    getWalletTransactions(req as AuthenticatedRequest, res, next),
);

export default router;
