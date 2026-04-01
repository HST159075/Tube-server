import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (typeof reviewId !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid review ID" });
    }

    const existing = await prisma.like.findUnique({
      where: {
        userId_reviewId: { userId, reviewId },
      },
    });

    if (existing) {
      await prisma.like.delete({
        where: {
          userId_reviewId: { userId, reviewId },
        },
      });
      return res.json({ success: true, liked: false, message: "Unliked" });
    } else {
      await prisma.like.create({
        data: { userId, reviewId },
      });
      return res.json({ success: true, liked: true, message: "Liked" });
    }
  } catch (error: any) {
    if (error.code === "P2003") {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLikeCount = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    if (typeof reviewId !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid review ID" });
    }
    const count = await prisma.like.count({
      where: { reviewId },
    });
    res.json({ success: true, count });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
