import { Router } from "express";
import { getTransactionHistory } from "@/controllers/transaction.controller";
import { transactionHistoryValidator } from "@/validators/transaction.validator";
import { validate } from "@/middleware/validate.middleware";
import { authenticate } from "@/middleware/auth.middleware";

const router = Router();

router.use(authenticate);

// GET /api/v1/transactions/:userId/history
router.get(
  "/:userId/history",
  transactionHistoryValidator,
  validate,
  getTransactionHistory,
);

export default router;
