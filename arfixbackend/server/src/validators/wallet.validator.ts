import { query } from "express-validator";

export const walletTransactionsQueryValidator = [
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
    .isIn(["EARNED", "REDEEMED", "BONUS"])
    .withMessage("Type must be one of: EARNED, REDEEMED, BONUS"),
];
