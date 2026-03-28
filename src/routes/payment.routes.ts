import { Router } from "express";
import { createCheckoutSession, confirmPayment } from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create-checkout", authMiddleware, createCheckoutSession);
router.get("/confirm", authMiddleware, confirmPayment);

export default router;