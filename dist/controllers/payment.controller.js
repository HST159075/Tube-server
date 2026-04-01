import SSLCommerzPayment from "sslcommerz-lts";
import { prisma } from "../lib/prisma.js";
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = process.env.IS_LIVE === 'true'; // এটা এখন false হিসেবে কাজ করবে
export const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { planType, amount } = req.body;
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        // ইউনিক ট্রানজেকশন আইডি তৈরি
        const transactionId = `TXN-${Date.now()}-${userId.substring(0, 5)}`;
        const data = {
            total_amount: Number(amount),
            currency: "BDT",
            tran_id: transactionId, // এটি অবশ্যই ইউনিক হতে হবে
            success_url: `${process.env.BACKEND_URL}/api/payment/success?userId=${userId}&planType=${planType}`,
            fail_url: `${process.env.BACKEND_URL}/api/payment/fail`,
            cancel_url: `${process.env.BACKEND_URL}/api/payment/cancel`,
            ipn_url: `${process.env.BACKEND_URL}/api/payment/ipn`,
            shipping_method: "No",
            product_name: `CineTube ${planType} Subscription`,
            product_category: "Subscription",
            product_profile: "digital-goods",
            cus_name: req.user?.name || "Customer Name",
            cus_email: req.user?.email || "customer@example.com",
            cus_add1: "Dhaka",
            cus_city: "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: "01700000000",
        };
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        sslcz.init(data).then((apiResponse) => {
            // GatewayPageURL হলো সেই লিঙ্ক যেখানে ইউজার পেমেন্ট করবে
            let GatewayPageURL = apiResponse.GatewayPageURL;
            res.status(200).json({ success: true, url: GatewayPageURL });
        });
    }
    catch (error) {
        console.error("SSLCommerz Session Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
export const confirmPayment = async (req, res) => {
    try {
        // SSLCommerz সাকসেস ইউআরএলে বডিতে ডাটা পাঠায় (POST রিকোয়েস্ট)
        const { userId, planType } = req.query; // আমরা success_url এ যা পাঠিয়েছিলাম
        const { status, tran_id, amount } = req.body;
        if (status === "VALID") {
            const duration = planType === "YEARLY" ? 365 : 30;
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + duration);
            // ডাটাবেস আপডেট
            await prisma.user.update({
                where: { id: userId },
                data: {
                    isSubscribed: true,
                    subscriptionEnd: expiryDate,
                },
            });
            await prisma.transaction.create({
                data: {
                    userId: userId,
                    amount: Number(amount),
                    status: "COMPLETED",
                    provider: "SSLCOMMERZ",
                    transactionId: tran_id,
                },
            });
            // পেমেন্ট সাকসেস হওয়ার পর ফ্রন্টএন্ডে রিডাইরেক্ট করে দিন
            return res.redirect(`${process.env.CLIENT_URL}/payment-success`);
        }
        res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
    }
    catch (error) {
        console.error("Payment Confirmation Error:", error.message);
        res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
    }
};
//# sourceMappingURL=payment.controller.js.map