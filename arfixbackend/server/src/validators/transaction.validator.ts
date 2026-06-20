import { query, param } from "express-validator";
import { TransactionType } from "@/types/Transaction";

export const transactionHistoryValidator = [
  param("userId").isMongoId().withMessage("Invalid user ID"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("type")
    .optional()
    .isIn(Object.values(TransactionType))
    .withMessage(
      `Type must be one of: ${Object.values(TransactionType).join(", ")}`,
    ),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("startDate must be a valid ISO 8601 date"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate must be a valid ISO 8601 date"),
];
