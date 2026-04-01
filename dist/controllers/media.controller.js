import { prisma } from "../lib/prisma.js";
// ১. Get All Media with Filters
export const getAllMedia = async (req, res) => {
    try {
        const { genre, type, search, sortBy } = req.query;
        const where = {};
        if (type)
            where.type = type;
        if (genre)
            where.genres = { has: genre };
        if (search) {
            where.OR = [
                { title: { contains: String(search), mode: 'insensitive' } },
                { director: { contains: String(search), mode: 'insensitive' } }
            ];
        }
        const media = await prisma.media.findMany({
            where,
            include: {
                _count: { select: { reviews: true } }
            },
            orderBy: sortBy === 'rating' ? { avgRating: 'desc' } : { createdAt: 'desc' }
        });
        res.status(200).json({ success: true, data: media });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const createMedia = async (req, res) => {
    try {
        const data = req.body;
        if (!data.title || !data.videoUrl) {
            return res.status(400).json({ success: false, message: "Title and Video URL are required" });
        }
        const newMedia = await prisma.media.create({
            data: {
                ...data,
                releaseYear: data.releaseYear ? Number(data.releaseYear) : undefined,
            }
        });
        res.status(201).json({ success: true, data: newMedia });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
export const getMediaById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ success: false, message: "Media ID is required" });
        }
        const media = await prisma.media.findUnique({
            where: { id: id },
            include: {
                reviews: {
                    where: { isApproved: true },
                    include: {
                        user: {
                            select: { name: true, image: true }
                        }
                    }
                }
            }
        });
        if (!media) {
            return res.status(404).json({ success: false, message: "Media not found" });
        }
        res.status(200).json({ success: true, data: media });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const watchMedia = async (req, res) => {
    try {
        const id = req.params.id;
        const media = await prisma.media.findUnique({
            where: { id: id },
            select: { videoUrl: true, title: true }
        });
        if (!media) {
            return res.status(404).json({ success: false, message: "Media not found" });
        }
        res.status(200).json({
            success: true,
            message: `Streaming started for: ${media.title}`,
            videoUrl: media.videoUrl
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const deleteMedia = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ success: false, message: "Valid Media ID is required" });
        }
        await prisma.media.delete({
            where: { id: id }
        });
        res.status(200).json({ success: true, message: "Movie deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete movie. It might not exist." });
    }
};
//# sourceMappingURL=media.controller.js.map