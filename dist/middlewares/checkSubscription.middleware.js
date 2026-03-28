import { prisma } from "../lib/prisma";
export const checkContentAccess = async (req, res, next) => {
    try {
        // ১. আইডি নিশ্চিত করা (Type Casting)
        const mediaId = req.params.id;
        const userId = req.user?.id;
        if (!mediaId) {
            return res.status(400).json({ success: false, message: "Media ID is required" });
        }
        const media = await prisma.media.findUnique({
            where: { id: mediaId },
            select: { priceType: true }
        });
        if (!media) {
            return res.status(404).json({ success: false, message: "Media not found" });
        }
        if (media.priceType === "FREE") {
            return next();
        }
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized! Please login." });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isSubscribed: true, subscriptionEnd: true }
        });
        if (!user?.isSubscribed) {
            return res.status(403).json({
                success: false,
                message: "This is a premium movie. Please subscribe to watch.",
            });
        }
        if (user.subscriptionEnd && new Date() > new Date(user.subscriptionEnd)) {
            return res.status(403).json({
                success: false,
                message: "Your subscription has expired. Please renew to continue watching.",
            });
        }
        next();
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};
//# sourceMappingURL=checkSubscription.middleware.js.map