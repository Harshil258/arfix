import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import {
  listRewards,
  redeemReward,
  listMyRedemptions,
} from "@/controllers/reward.controller";
import { AuthenticatedRequest } from "@/types/User";
import { param } from "express-validator";

const router = Router();

router.use(authenticate);

// GET /api/v1/rewards/redemptions — before /:rewardId
router.get(
  "/redemptions",
  (req: Request, res: Response, next: NextFunction) =>
    listMyRedemptions(req as AuthenticatedRequest, res, next),
);

// GET /api/v1/rewards
router.get("/", (req: Request, res: Response, next: NextFunction) =>
  listRewards(req as AuthenticatedRequest, res, next),
);

// POST /api/v1/rewards/:rewardId/redeem
router.post(
  "/:rewardId/redeem",
  param("rewardId").isMongoId().withMessage("Invalid reward ID"),
  validate,
  (req: Request, res: Response, next: NextFunction) =>
    redeemReward(req as AuthenticatedRequest, res, next),
);

export default router;
