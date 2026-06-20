import { Router, Request, Response, NextFunction } from "express";
import {
  signup,
  login,
  adminLogin,
  getMe,
  updateMyProfile,
  changeMyPassword,
} from "../controllers/auth.controller";
import {
  sendOtp,
  verifyOtp,
  googleSignIn,
  forgotPassword,
  resetPassword,
  deleteMyAccount,
  updateMobile,
  refreshAccessToken,
  sendEmailOtp,
  verifyEmailOtp,
} from "../controllers/auth.extended.controller";
import {
  signupValidator,
  loginValidator,
  updateMyProfileValidator,
  changePasswordValidator,
} from "../validators/auth.validator";
import {
  sendOtpValidator,
  verifyOtpValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  deleteAccountValidator,
  updateMobileValidator,
  refreshTokenValidator,
  googleSignInValidator,
  sendEmailOtpValidator,
  verifyEmailOtpValidator,
} from "../validators/auth.extended.validator";
import { validate } from "../middleware/validate.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { AuthenticatedRequest } from "../types/User";

const router = Router();

// ─── Public Routes ────────────────────────────────────────────────────────────
router.post("/signup", signupValidator, validate, signup);
router.post("/login", loginValidator, validate, login);
router.post("/admin/login", loginValidator, validate, adminLogin);

router.post("/send-otp", sendOtpValidator, validate, sendOtp);
router.post("/verify-otp", verifyOtpValidator, validate, verifyOtp);
router.post("/send-otp/email", sendEmailOtpValidator, validate, sendEmailOtp);
router.post("/verify-otp/email", verifyEmailOtpValidator, validate, verifyEmailOtp);
router.post("/google", googleSignInValidator, validate, googleSignIn);
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  forgotPassword,
);
router.post("/reset-password", resetPasswordValidator, validate, resetPassword);
router.post("/refresh", refreshTokenValidator, validate, refreshAccessToken);

// ─── Protected Routes ─────────────────────────────────────────────────────────
router.get(
  "/me",
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    getMe(req as AuthenticatedRequest, res, next),
);

router.patch(
  "/me",
  authenticate,
  updateMyProfileValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    updateMyProfile(req as AuthenticatedRequest, res, next),
);

router.patch(
  "/password",
  authenticate,
  changePasswordValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    changeMyPassword(req as AuthenticatedRequest, res, next),
);

router.patch(
  "/mobile",
  authenticate,
  updateMobileValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    updateMobile(req as AuthenticatedRequest, res, next),
);

router.delete(
  "/me",
  authenticate,
  deleteAccountValidator,
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    deleteMyAccount(req as AuthenticatedRequest, res, next),
);

export default router;
