import { Router, Request, Response, NextFunction } from "express";
import {
  createCoupons,
  listCouponSessions,
  getScanHistory,
  scanCoupon,
  inactivateCoupons,
  updateCoupon,
  generateCouponPDF,
} from "@/controllers/coupon.controller";
import {
  createCouponsValidator,
  listCouponSessionsQueryValidator,
  scanCouponValidator,
  inactivateCouponsValidator,
  updateCouponValidator,
} from "@/validators/coupon.validator";
import { validate } from "@/middleware/validate.middleware";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { AuthenticatedRequest, UserRole } from "@/types/User";

const router = Router();

// ─── All coupon routes require authentication ──────────────────────────────
router.use(authenticate);

// ── 0. List coupon sessions ─────────────────────────────────────────────────
//    GET /api/v1/coupons/sessions
router.get(
  "/sessions",
  authorize(UserRole.STAFF, UserRole.ADMIN),
  listCouponSessionsQueryValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    listCouponSessions(req as AuthenticatedRequest, res, next),
);

// ── 1. Create multiple coupons ─────────────────────────────────────────────
//    POST /api/v1/coupons/create
router.post(
  "/create",
  authorize(UserRole.STAFF, UserRole.ADMIN),
  createCouponsValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    createCoupons(req as AuthenticatedRequest, res, next),
);

// ── 1b. Scan history (mobile) ─────────────────────────────────────────────
//    GET /api/v1/coupons/history
router.get("/history", getScanHistory);

// ── 2. Scan a coupon ───────────────────────────────────────────────────────
//    POST /api/v1/coupons/scan
router.post("/scan", scanCouponValidator, validate, scanCoupon);

// ── 3. Inactivate one or many coupons ─────────────────────────────────────
//    PATCH /api/v1/coupons/inactivate
router.patch(
  "/inactivate",
  inactivateCouponsValidator,
  validate,
  inactivateCoupons,
);

// ── 4. Update a single coupon ──────────────────────────────────────────────
//    PATCH /api/v1/coupons/:id
router.patch("/:id", updateCouponValidator, validate, updateCoupon);

// ── 5. Generate PDF for a coupon session ───────────────────────────────────
//    GET /api/v1/session/:sessionId/pdf
router.get(
  "/session/:sessionId/pdf",
  authorize(UserRole.STAFF, UserRole.ADMIN),
  generateCouponPDF,
);

export default router;
