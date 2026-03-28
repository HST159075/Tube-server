import { Router } from "express";
import {
  getMyProfile,
  updateProfile,
  getAllUsers,
  getAdminStats,
  getAllUsersForAdmin,
  deleteUser, // নতুন ইমপোর্ট
} from "../controllers/user.controller.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/auth.middleware.js";
import { upload } from "../lib/cloudinary.js";

const router = Router();

// ১. এডমিন ড্যাশবোর্ড স্ট্যাটাস
router.get("/admin/stats", authMiddleware, adminMiddleware, getAdminStats);

router.get(
  "/admin/all-users",
  authMiddleware,
  adminMiddleware,
  getAllUsersForAdmin,
);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);
router.get("/all", authMiddleware, adminMiddleware, getAllUsers);
router.get("/me", authMiddleware, getMyProfile);
router.patch("/update", authMiddleware, upload.single("image"), updateProfile);

export default router;
