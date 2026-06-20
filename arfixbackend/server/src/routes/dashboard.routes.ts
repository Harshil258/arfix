import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { getDashboardSummary } from "@/controllers/dashboard.controller";
import { AuthenticatedRequest } from "@/types/User";

const router = Router();

router.get(
  "/summary",
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    getDashboardSummary(req as AuthenticatedRequest, res, next),
);

export default router;
