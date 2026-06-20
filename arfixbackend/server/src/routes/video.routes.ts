import { Router } from "express";
import { getVideos, createVideo } from "../controllers/video.controller";
import { authenticate } from "../middleware/auth.middleware";
import { createVideoValidator } from "../validators/video.validator";
import { validate } from "../middleware/validate.middleware";

const router = Router();

router.use(authenticate);

router.get("/", getVideos);
router.post("/", createVideoValidator, validate, createVideo);

export default router;
