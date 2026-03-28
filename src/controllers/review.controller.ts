import { Request, Response } from "express";
import { prisma } from "../lib/prisma";


export const getReviewsByMedia = async (req: Request, res: Response) => {
  try {
    const { mediaId } = req.query;

    if (!mediaId) {
      return res.status(400).json({ success: false, message: "mediaId is required in query" });
    }

    const reviews = await prisma.review.findMany({
      where: {
        mediaId: String(mediaId),
        isApproved: true, 
      },
      include: {
        user: {
          select: { name: true, image: true }, 
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const createReview = async (req: Request, res: Response) => {
  try {
    const { rating, content, hasSpoiler, tags, mediaId } = req.body;
    const userId = req.user.id; 

    const newReview = await prisma.review.create({
      data: {
        rating: Number(rating),
        content,
        hasSpoiler: Boolean(hasSpoiler),
        tags: tags || [],
        userId,
        mediaId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Review submitted! Waiting for approval.",
      data: newReview,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const approveReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedReview = await prisma.review.update({
      where: { id: String(id) },
      data: { isApproved: true },
    });

    
    const stats = await prisma.review.aggregate({
      where: { mediaId: updatedReview.mediaId, isApproved: true },
      _avg: { rating: true },
    });

    await prisma.media.update({
      where: { id: updatedReview.mediaId },
      data: { avgRating: stats._avg.rating || 0 },
    });

    res.status(200).json({ success: true, message: "Review approved successfully!" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: "Failed to approve review" });
  }
};