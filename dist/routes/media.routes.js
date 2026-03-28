import { Router } from "express";
import { getAllMedia, createMedia, getMediaById, watchMedia, deleteMedia } from "../controllers/media.controller.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";
import { checkContentAccess, } from "../middlewares/checkSubscription.middleware.js";
const router = Router();
router.get("/", getAllMedia);
router.get("/:id", getMediaById, deleteMedia);
router.post("/", authMiddleware, adminMiddleware, createMedia);
router.get("/watch/:id", authMiddleware, checkContentAccess, watchMedia);
export default router;
//# sourceMappingURL=media.routes.js.map