import { Router } from "express";
import { toggleLike, getLikeCount } from "../controllers/like.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:reviewId", authMiddleware, toggleLike);
router.get("/:reviewId/count", getLikeCount);

export default router;