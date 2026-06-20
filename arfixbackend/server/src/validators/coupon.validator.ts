import { body, param, query, ValidationChain } from "express-validator";
import { CouponStatus } from "@/types/Coupon";

// ─── List coupon sessions ─────────────────────────────────────────────────────
export const listCouponSessionsQueryValidator: ValidationChain[] = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100"),

  query("sortBy")
    .optional()
    .isIn(["createdAt"])
    .withMessage("sortBy must be createdAt"),

  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("order must be asc or desc"),
];

// ─── 1. Create Coupons ────────────────────────────────────────────────────────
export const createCouponsValidator = [
  body("quantity")
    .notEmpty().withMessage("Quantity is required")
    .isInt({ min: 1, max: 500 }).withMessage("Quantity must be between 1 and 500"),

  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),
];

// ─── 2. Scan Coupon ───────────────────────────────────────────────────────────
export const scanCouponValidator = [
  body("code")
    .trim()
    .notEmpty().withMessage("Coupon code is required"),

  body("id")
    .notEmpty().withMessage("Coupon ID is required")
    .isMongoId().withMessage("Invalid coupon ID format"),

  body("userId")
    .notEmpty().withMessage("User ID is required")
    .isMongoId().withMessage("Invalid user ID format"),
];

// ─── 3. Inactivate Coupons ───────────────────────────────────────────────────
export const inactivateCouponsValidator = [
  body("ids")
    .isArray({ min: 1 }).withMessage("ids must be a non-empty array")
    .custom((ids: unknown[]) => {
      const mongoIdRegex = /^[a-f\d]{24}$/i;
      const allValid = ids.every(
        (id) => typeof id === "string" && mongoIdRegex.test(id)
      );
      if (!allValid) throw new Error("All ids must be valid MongoDB ObjectIds");
      return true;
    }),

  body("isMultiple")
    .isBoolean().withMessage("isMultiple must be a boolean value"),
];

// ─── 4. Update Coupon ─────────────────────────────────────────────────────────
export const updateCouponValidator = [
  param("id")
    .isMongoId().withMessage("Invalid coupon ID in URL"),

  body("code")
    .optional()
    .trim()
    .notEmpty().withMessage("Code cannot be empty if provided"),

  body("price")
    .optional()
    .isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),

  body("status")
    .optional()
    .isIn(Object.values(CouponStatus))
    .withMessage(`Status must be one of: ${Object.values(CouponStatus).join(", ")}`),
];
