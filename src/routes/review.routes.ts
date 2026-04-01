import { Router } from "express";

import {
  createReview,
  approveReview,
  getReviewsByMedia,
  getAllReviewsForAdmin
} from "../controllers/review.controller.js";

import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getReviewsByMedia);
router.post("/", authMiddleware, createReview);
router.get("/admin/all", authMiddleware, adminMiddleware, getAllReviewsForAdmin);
router.patch("/approve/:id", authMiddleware, adminMiddleware, approveReview);

export default router;
