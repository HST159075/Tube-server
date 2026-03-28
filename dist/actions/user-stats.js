"use server";
import { prisma } from "../lib/prisma";
// তোমার প্রিজমা ক্লায়েন্ট যেখানে আছে সেখান থেকে ইমপোর্ট করো
export async function getUserStats(userId) {
    if (!userId)
        return { watchlistCount: 0, reviewCount: 0 };
    try {
        // ডাটাবেজ থেকে একসাথেই দুটি কাউন্ট নিয়ে আসা (Performance এর জন্য ভালো)
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