import { Router } from "express";
import { addComment, getComments, deleteComment } from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:reviewId", authMiddleware, addComment);
router.get("/:reviewId", getComments);
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;