import { prisma } from "../lib/prisma.js";
export const addComment = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user?.id;
        const { content } = req.body;
        // 1. Validation: Content check
        if (!content?.trim()) {
            return res.status(400).json({ success: false, message: "Content is required" });
        }
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        if (typeof reviewId !== "string") {
            return res.status(400).json({ success: false, message: "Invalid review ID" });
        }
        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                userId,
                reviewId,
            },
            include: {
                user: { select: { id: true, name: true, image: true } },
            },
        });
        res.status(201).json({ success: true, data: comment });
    }
    catch (error) {
        if (error.code === "P2003") {
            return res.status(404).json({ success: false, message: "Review not found" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getComments = async (req, res) => {
    try {
        const { reviewId } = req.params;
        // Type Guard
        if (typeof reviewId !== "string") {
            return res.status(400).json({ success: false, message: "Invalid review ID" });
        }
        const comments = await prisma.comment.findMany({
            where: { reviewId },
            include: {
                user: { select: { id: true, name: true, image: true } },
            },
            orderBy: { createdAt: "asc" },
        });
        res.json({ success: true, data: comments });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const deleteComment = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { commentId } = req.params;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        // Type Guard
        if (typeof commentId !== "string") {
            return res.status(400).json({ success: false, message: "Invalid comment ID" });
        }
        const deletion = await prisma.comment.deleteMany({
            where: {
                id: commentId,
                userId: userId,
            },
        });
        if (deletion.count === 0) {
            return res.status(404).json({
                success: false,
                message: "Comment not found or you are not authorized to delete it",
            });
        }
        res.json({ success: true, message: "Comment deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//# sourceMappingURL=comment.controller.js.map