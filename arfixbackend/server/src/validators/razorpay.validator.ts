import { body, query } from "express-validator";

export const createTopupValidator = [
  body("amount")
    .isFloat({ min: 1, max: 500000 })
    .withMessage("Amount must be between ₹1 and ₹5,00,000"),

  body("note")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Note cannot exceed 200 characters"),
];

export const listTransactionsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("from")
    .optional()
    .isISO8601()
    .withMessage("from must be a valid ISO date"),

  query("to")
    .optional()
    .isISO8601()
    .withMessage("to must be a valid ISO date"),
];
