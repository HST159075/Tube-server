"use server";
import { prisma } from "../lib/prisma.js";
export async function getUserStats(userId) {
    if (!userId)
        return { watchlistCount: 0, reviewCount: 0 };
    try {
        const [watchlistCount, reviewCount] = await Promise.all([
            prisma.watchlist.count({
                where: { userId: userId },
            }),
            prisma.review.count({
                where: { userId: userId },
            }),
        ]);
        return {
            watchlistCount,
            reviewCount,
        };
    }
    catch (error) {
        console.error("Database Error:", error);
        return { watchlistCount: 0, reviewCount: 0 };
    }
}
//# sourceMappingURL=user-stats.js.map