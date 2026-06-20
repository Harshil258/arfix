import { Router } from "express";
import { listBanners } from "@/controllers/misc.controller";

const router = Router();

router.get("/", listBanners);

export default router;
