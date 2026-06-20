import { body, param, query, ValidationChain } from "express-validator";

export const listUsersQueryValidator: ValidationChain[] = [
  query("listType")
    .optional()
    .isIn(["user", "staff"])
    .withMessage("listType must be either user or staff"),
];

const passwordCreateRules = body("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password must contain at least one lowercase letter")
  .matches(/\d/)
  .withMessage("Password must contain at least one number");

export const createUserValidator: ValidationChain[] = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  passwordCreateRules,

  body("role")
    .optional()
    .isIn(["user", "admin", "staff"])
    .withMessage("Invalid role"),
];

const passwordUpdateOptional = body("password")
  .optional({ values: "falsy" })
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters")
  .matches(/[A-Z]/)
  .withMessage("Password must contain at least one uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password must contain at least one lowercase letter")
  .matches(/\d/)
  .withMessage("Password must contain at least one number");

export const userIdParamValidator: ValidationChain[] = [
  param("id").isMongoId().withMessage("Invalid user ID"),
];

export const updateUserValidator: ValidationChain[] = [
  ...userIdParamValidator,

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  passwordUpdateOptional,

  body("role")
    .optional()
    .isIn(["user", "admin", "staff"])
    .withMessage("Invalid role"),

  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
];
