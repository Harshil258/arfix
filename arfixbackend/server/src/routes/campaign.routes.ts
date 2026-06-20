import { Router } from "express";
import { listCampaigns } from "@/controllers/misc.controller";

const router = Router();

router.get("/", listCampaigns);

export default router;
