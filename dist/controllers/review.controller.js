import { prisma } from "../lib/prisma.js";
// GET /api/v1/reviews?mediaId=...
export const getReviewsByMedia = async (req, res) => {
    try {
        const { mediaId } = req.query;
        if (typeof mediaId !== "string") {
            return res.status(400).json({ success: false, message: "mediaId is required and must be a string" });
        }
        const reviews = await prisma.review.findMany({
            where: {
                mediaId: mediaId,
                isApproved: true,
            },
            include: {
                user: { select: { id: true, name: true, image: true } },
                _count: { select: { likes: true, comments: true } }, // লাইক ও কমেন্ট সংখ্যা
                comments: {
                    include: {
                        user: { select: { id: true, name: true, image: true } }
                    },
                    orderBy: { createdAt: "asc" },
                    take: 5, // লেটেস্ট ৫টি কমেন্ট দেখাবে
                },
            },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, data: reviews });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// POST /api/v1/reviews
export const createReview = async (req, res) => {
    try {
        const { rating, content, hasSpoiler, tags, mediaId } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const newReview = await prisma.review.create({
            data: {
                rating: Number(rating),
                content,
                hasSpoiler: Boolean(hasSpoiler),
                tags: Array.isArray(tags) ? tags : [],
                userId,
                mediaId: String(mediaId),
            },
        });
        res.status(201).json({
            success: true,
            message: "Review submitted! Waiting for approval.",
            data: newReview,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
// PATCH /api/v1/reviews/approve/:id
export const approveReview = async (req, res) => {
    try {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({ success: false, message: "Invalid review ID" });
        }
        // ১. রিভিউ এপ্রুভ করা
        const updatedReview = await prisma.review.update({
            where: { id },
            data: { isApproved: true },
        });
        // ২. ওই মিডিয়ার সব এপ্রুভড রিভিউর এভারেজ রেটিং বের করা
        const stats = await prisma.review.aggregate({
            where: {
                mediaId: updatedReview.mediaId,
                isApproved: true
            },
            _avg: { rating: true },
        });
        // ৩. মিডিয়া টেবিলে এভারেজ রেটিং আপডেট করা
        await prisma.media.update({
            where: { id: updatedReview.mediaId },
            data: {
                avgRating: stats._avg.rating || 0
            },
        });
        res.status(200).json({ success: true, message: "Review approved and rating updated!" });
    }
    catch (error) {
        res.status(400).json({ success: false, message: "Failed to approve review" });
    }
};
//# sourceMappingURL=review.controller.js.map