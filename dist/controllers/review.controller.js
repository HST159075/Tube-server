import { prisma } from "../lib/prisma.js";
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
                    take: 5,
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
export const approveReview = async (req, res) => {
    try {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({ success: false, message: "Invalid review ID" });
        }
        const updatedReview = await prisma.review.update({
            where: { id },
            data: { isApproved: true },
        });
        const stats = await prisma.review.aggregate({
            where: {
                mediaId: updatedReview.mediaId,
                isApproved: true
            },
            _avg: { rating: true },
        });
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
export const getAllReviewsForAdmin = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                user: { select: { id: true, name: true, image: true } },
                media: { select: { title: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        res.json({ success: true, data: reviews });
    }
    catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};
//# sourceMappingURL=review.controller.js.map