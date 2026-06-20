import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { getLeaderboard } from "@/controllers/misc.controller";
import { AuthenticatedRequest } from "@/types/User";

const router = Router();

router.get(
  "/",
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    getLeaderboard(req as AuthenticatedRequest, res, next),
);

export default router;
