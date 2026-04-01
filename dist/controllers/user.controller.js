import { prisma } from "../lib/prisma.js";
export const getAllUsersForAdmin = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
                isSubscribed: true,
                subscriptionEnd: true,
                createdAt: true,
                _count: { select: { reviews: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        const totalUsers = users.length;
        const subscribedUsers = users.filter((u) => u.isSubscribed).length;
        res.status(200).json({
            success: true,
            meta: {
                totalUsers,
                subscribedUsers,
                freeUsers: totalUsers - subscribedUsers,
            },
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                isSubscribed: true,
                subscriptionEnd: true,
                createdAt: true,
                _count: {
                    select: { watchlist: true, reviews: true },
                },
            },
        });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;
        const imageUrl = req.file ? req.file.path : undefined;
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: name || undefined,
                ...(imageUrl && { image: imageUrl }),
            },
        });
        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            data: {
                name: updatedUser.name,
                image: updatedUser.image,
            },
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
export const getAdminStats = async (req, res) => {
    try {
        const [totalUsers, totalMovies, activeSubscriptions] = await Promise.all([
            prisma.user.count(),
            prisma.media.count(),
            prisma.user.count({ where: { isSubscribed: true } })
        ]);
        res.status(200).json({
            success: true,
            data: { totalUsers, totalMovies, activeSubscriptions }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isSubscribed: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ success: false, message: "Valid User ID is required" });
        }
        if (id === req.user.id) {
            return res.status(400).json({ success: false, message: "You cannot delete your own admin account!" });
        }
        await prisma.user.delete({
            where: { id: id },
        });
        res.status(200).json({ success: true, message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete user or user does not exist." });
    }
};
//# sourceMappingURL=user.controller.js.map