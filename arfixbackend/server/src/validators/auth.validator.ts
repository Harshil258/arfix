import { body, ValidationChain } from "express-validator";

export const signupValidator: ValidationChain[] = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("mobile")
    .trim()
    .notEmpty().withMessage("Mobile number is required")
    .custom((value: string) => {
      if (!/^\+?[\d\s-]{7,20}$/.test(value)) {
        throw new Error("Please provide a valid mobile number");
      }
      return true;
    }),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/).withMessage("Password must contain at least one number"),

  body("confirmPassword")
    .notEmpty().withMessage("Please confirm your password")
    .custom((value: string, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

export const loginValidator: ValidationChain[] = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required"),
];

const mobileBody = body("mobile")
  .optional({ values: "null" })
  .trim()
  .custom((value: string | undefined) => {
    if (value === undefined || value === "") return true;
    if (!/^\+?[\d\s-]{7,20}$/.test(value)) {
      throw new Error("Please provide a valid mobile number");
    }
    return true;
  });

export const updateMyProfileValidator: ValidationChain[] = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),

  body("email")
    .optional({ values: "null" })
    .trim()
    .notEmpty().withMessage("Email cannot be empty if provided")
    .isEmail().withMessage("Please provide a valid email address")
    .normalizeEmail(),

  mobileBody,
];

export const changePasswordValidator: ValidationChain[] = [
  body("currentPassword")
    .notEmpty().withMessage("Current password is required"),

  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/).withMessage("Password must contain at least one number"),

  body("confirmNewPassword")
    .notEmpty().withMessage("Please confirm your new password")
    .custom((value: string, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("New passwords do not match");
      }
      return true;
    }),
];
