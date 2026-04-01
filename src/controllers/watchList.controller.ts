import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const addToWatchlist = async (req: Request, res: Response) => {
  try {
    const { mediaId } = req.body;
    const userId = req.user.id;

    const existingEntry = await prisma.watchlist.findUnique({
      where: {
        userId_mediaId: { userId, mediaId },
      },
    });

    if (existingEntry) {
      return res
        .status(400)
        .json({ success: false, message: "Already in your watchlist!" });
    }

    const newEntry = await prisma.watchlist.create({
      data: { userId, mediaId },
    });

    res
      .status(201)
      .json({ success: true, message: "Added to watchlist!", data: newEntry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyWatchlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const watchlist = await prisma.watchlist.findMany({
      where: { userId },
      include: {
        media: true,
      },
      orderBy: { id: "desc" },
    });

    res.status(200).json({ success: true, data: watchlist });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromWatchlist = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Watchlist entry ID is required" });
    }

    await prisma.watchlist.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({ success: true, message: "Removed from watchlist!" });
  } catch (error: any) {
    res
      .status(400)
      .json({ success: false, message: "Failed to remove item. Invalid ID." });
  }
};
