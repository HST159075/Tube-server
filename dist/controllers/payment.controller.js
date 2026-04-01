import Stripe from "stripe";
import { prisma } from "../lib/prisma.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { planType, amount } = req.body;
        if (!userId) {
            return res
                .status(401)
                .json({ success: false, message: "User not authenticated" });
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `CineTube ${planType} Subscription`,
                            description: "Access to all premium movies and series",
                        },
                        unit_amount: Math.round(Number(amount) * 100), // সেন্টে কনভার্ট
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
            metadata: { userId, planType },
        });
        res.status(200).json({ success: true, url: session.url });
    }
    catch (error) {
        console.error("Stripe Session Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
export const confirmPayment = async (req, res) => {
    try {
        const { session_id } = req.query;
        if (!session_id) {
            return res
                .status(400)
                .json({ success: false, message: "Session ID is required" });
        }
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === "paid") {
            const userId = session.metadata?.userId;
            const planType = session.metadata?.planType;
            const duration = planType === "YEARLY" ? 365 : 30;
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + duration);
            await prisma.user.update({
                where: { id: userId },
                data: {
                    isSubscribed: true,
                    subscriptionEnd: expiryDate,
                },
            });
            await prisma.transaction.create({
                data: {
                    userId,
                    amount: (session.amount_total || 0) / 100,
                    status: "COMPLETED",
                    provider: "STRIPE",
                    transactionId: session.id,
                },
            });
            return res
                .status(200)
                .json({ success: true, message: "Subscription activated!" });
        }
        res.status(400).json({ success: false, message: "Payment not completed" });
    }
    catch (error) {
        console.error("Payment Confirmation Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
//# sourceMappingURL=payment.controller.js.map