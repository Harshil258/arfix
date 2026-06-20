import { body, param } from "express-validator";

export const sendOtpValidator = [
  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile is required")
    .matches(/^\+?[\d\s-]{7,20}$/)
    .withMessage("Please provide a valid mobile number"),

  body("type")
    .isIn(["LOGIN", "SIGNUP", "FORGOT_PASSWORD", "MOBILE_UPDATE"])
    .withMessage("Type must be LOGIN, SIGNUP, FORGOT_PASSWORD, or MOBILE_UPDATE"),
];

export const sendEmailOtpValidator = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("type")
    .isIn(["LOGIN", "SIGNUP", "FORGOT_PASSWORD", "MOBILE_UPDATE"]) // MOBILE_UPDATE retained for compatibility
    .withMessage("Type must be LOGIN, SIGNUP, or FORGOT_PASSWORD"),
];

export const verifyOtpValidator = [
  body("mobile").trim().notEmpty().withMessage("Mobile is required"),
  body("otpId").trim().notEmpty().withMessage("otpId is required"),
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 4, max: 8 })
    .withMessage("OTP must be 4-8 characters"),
];

export const verifyEmailOtpValidator = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("otpId").trim().notEmpty().withMessage("otpId is required"),
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 4, max: 8 })
    .withMessage("OTP must be 4-8 characters"),
];

export const forgotPasswordValidator = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
];

export const resetPasswordValidator = [
  body("token").trim().notEmpty().withMessage("Reset token is required"),
  body("newPassword")
    .notEmpty()
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[a-z]/)
    .matches(/\d/),
  body("confirmNewPassword").custom((value: string, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

export const deleteAccountValidator = [
  body("password").notEmpty().withMessage("Password is required"),
];

export const updateMobileValidator = [
  body("mobile")
    .trim()
    .notEmpty()
    .matches(/^\+?[\d\s-]{7,20}$/)
    .withMessage("Please provide a valid mobile number"),
  body("otpId").trim().notEmpty(),
  body("otp").trim().notEmpty(),
];

export const refreshTokenValidator = [
  body("refreshToken").trim().notEmpty().withMessage("Refresh token is required"),
];

export const googleSignInValidator = [
  body("idToken").trim().notEmpty().withMessage("Google idToken is required"),
];

export const notificationIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid notification ID"),
];
