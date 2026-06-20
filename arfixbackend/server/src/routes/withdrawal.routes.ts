import { Router } from "express";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { UserRole } from "@/types/User";
import {
  requestWithdrawal,
  getPendingWithdrawalCount,
  getWithdrawalStatus,
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  getWithdrawalHistory,
  handleRazorpayWebhook
} from "@/controllers/withdrawal.controller";
import {
  createWithdrawalValidator,
  approveWithdrawalValidator,
  rejectWithdrawalValidator,
  userIdValidator
} from "@/validators/withdrawal.validator";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// Webhook — no auth, must be registered BEFORE express.json() in app.ts
// Add in app.ts:
//   app.use("/api/v1/withdrawals/webhook", express.raw({ type: "application/json" }));
// ─────────────────────────────────────────────────────────────────────────────
router.post("/webhook", handleRazorpayWebhook);

// ─────────────────────────────────────────────────────────────────────────────
// Admin routes — MUST come before /:userId/* param routes
// otherwise Express matches "pending-count" and "/" as a userId
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/v1/withdrawals/pending-count
router.get(
  "/pending-count",
  authenticate,
  authorize(UserRole.ADMIN),
  getPendingWithdrawalCount
);

// GET /api/v1/withdrawals
router.get("/", authenticate, authorize(UserRole.ADMIN), getAllWithdrawals);

// PATCH /api/v1/withdrawals/:withdrawalId/approve
router.patch(
  "/:withdrawalId/approve",
  authenticate,
  authorize(UserRole.ADMIN),
  approveWithdrawalValidator,
  validate,
  approveWithdrawal
);

// PATCH /api/v1/withdrawals/:withdrawalId/reject
router.patch(
  "/:withdrawalId/reject",
  authenticate,
  authorize(UserRole.ADMIN),
  rejectWithdrawalValidator,
  validate,
  rejectWithdrawal
);

// ─────────────────────────────────────────────────────────────────────────────
// User routes — param routes always declared last
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/v1/withdrawals
router.post(
  "/",
  authenticate,
  createWithdrawalValidator,
  validate,
  requestWithdrawal
);

// GET /api/v1/withdrawals/:userId/status
router.get(
  "/:userId/status",
  authenticate,
  userIdValidator,
  validate,
  getWithdrawalStatus
);

// GET /api/v1/withdrawals/:userId/history
router.get(
  "/:userId/history",
  authenticate,
  userIdValidator,
  validate,
  getWithdrawalHistory
);

export default router;
