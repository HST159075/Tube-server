import { Router } from "express";
import { createCheckoutSession, confirmPayment } from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// ১. চেকআউট সেশন তৈরি (ইউজার যখন সাবস্ক্রাইব বাটনে ক্লিক করবে)
router.post("/create-checkout", authMiddleware, createCheckoutSession);

// ২. পেমেন্ট সাকসেস হলে SSLCommerz এখানে ডাটা পাঠাবে
// এটি POST হতে হবে কারণ SSLCommerz সাকসেস ডাটা বডিতে পাঠায়
router.post("/success", confirmPayment);

// ৩. ফেইল বা ক্যানসেল রাউট (ঐচ্ছিক কিন্তু ভালো প্র্যাকটিস)
router.post("/fail", (req, res) => res.redirect(`${process.env.CLIENT_URL}/payment-failed`));
router.post("/cancel", (req, res) => res.redirect(`${process.env.CLIENT_URL}/payment-failed`));

export default router;