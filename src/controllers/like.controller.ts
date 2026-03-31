import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

/**
 * Re-using the custom type for authenticated requests.
 */
interface AuthRequest extends Request {
  user?: { id: string };
}

// POST /api/v1/likes/:reviewId — Toggle Like/Unlike
export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id;

    // 1. Auth Check
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 2. Type Guard for reviewId (Fixes exactOptionalPropertyTypes error)
    if (typeof reviewId !== "string") {
      return res.status(400).json({ success: false, message: "Invalid review ID" });
    }

    // 3. Check if like already exists using the composite unique key
    const existing = await prisma.like.findUnique({
      where: { 
        userId_reviewId: { userId, reviewId } 
      },
    });

    if (existing) {
      // If it exists, remove it (Unlike)
      await prisma.like.delete({
        where: { 
          userId_reviewId: { userId, reviewId } 
        },
      });
      return res.json({ success: true, liked: false, message: "Unliked" });
    } else {
      // If it doesn't exist, create it (Like)
      // Prisma will throw P2003 if the reviewId doesn't actually exist in the Review table
      await prisma.like.create({
        data: { userId, reviewId },
      });
      return res.json({ success: true, liked: true, message: "Liked" });
    }
  } catch (error: any) {
    // Foreign key check: ensuring the reviewId exists in the parent table
    if (error.code === "P2003") {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/likes/:reviewId/count — Get total like count
export const getLikeCount = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;

    // Type Guard
    if (typeof reviewId !== "string") {
      return res.status(400).json({ success: false, message: "Invalid review ID" });
    }

    const count = await prisma.like.count({
      where: { reviewId },
    });

    res.json({ success: true, count });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};