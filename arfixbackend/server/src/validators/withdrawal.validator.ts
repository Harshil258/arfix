import { body, param, ValidationChain } from "express-validator";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/withdrawals — create withdrawal request
// ─────────────────────────────────────────────────────────────────────────────
export const createWithdrawalValidator: ValidationChain[] = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required.")
    .isFloat({ min: 100, max: 100000 })
    .withMessage("Amount must be between ₹100 and ₹1,00,000."),

  body("bankDetails.accountHolderName")
    .trim()
    .notEmpty()
    .withMessage("Account holder name is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Account holder name must be between 2 and 100 characters."),

  body("bankDetails.accountNumber")
    .trim()
    .notEmpty()
    .withMessage("Account number is required.")
    .matches(/^\d{9,18}$/)
    .withMessage("Account number must be 9–18 digits."),

  body("bankDetails.ifscCode")
    .trim()
    .notEmpty()
    .withMessage("IFSC code is required.")
    .toUpperCase() // normalize before regex check
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    .withMessage("Invalid IFSC code format (e.g. SBIN0001234)."),

  // Optional — stored for display, not sent to Razorpay
  body("bankDetails.bankName")
    .optional({ nullable: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Bank name must be between 2 and 100 characters.")
];

// ─────────────────────────────────────────────────────────────────────────────
// Param — :withdrawalId
// ─────────────────────────────────────────────────────────────────────────────
export const withdrawalIdValidator: ValidationChain[] = [
  param("withdrawalId")
    .notEmpty()
    .withMessage("Withdrawal ID is required.")
    .isMongoId()
    .withMessage("Invalid withdrawal ID.")
];

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/v1/withdrawals/:withdrawalId/approve
// ─────────────────────────────────────────────────────────────────────────────
export const approveWithdrawalValidator: ValidationChain[] = [
  param("withdrawalId")
    .notEmpty()
    .withMessage("Withdrawal ID is required.")
    .isMongoId()
    .withMessage("Invalid withdrawal ID."),

  body("approvalReason")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Approval reason cannot exceed 500 characters.")
];

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/v1/withdrawals/:withdrawalId/reject
// ─────────────────────────────────────────────────────────────────────────────
export const rejectWithdrawalValidator: ValidationChain[] = [
  param("withdrawalId")
    .notEmpty()
    .withMessage("Withdrawal ID is required.")
    .isMongoId()
    .withMessage("Invalid withdrawal ID."),

  body("rejectionReason")
    .trim()
    .notEmpty()
    .withMessage("Rejection reason is required.")
    .isLength({ min: 5, max: 500 })
    .withMessage("Rejection reason must be between 5 and 500 characters.")
];

// ─────────────────────────────────────────────────────────────────────────────
// Param — :userId
// ─────────────────────────────────────────────────────────────────────────────
export const userIdValidator: ValidationChain[] = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required.")
    .isMongoId()
    .withMessage("Invalid user ID.")
];
