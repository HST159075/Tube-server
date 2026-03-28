import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { addToWatchlist, getMyWatchlist, removeFromWatchlist } from "../controllers/watchList.controller";
const router = Router();
router.use(authMiddleware);
router.post("/", addToWatchlist);
router.get("/", getMyWatchlist);
router.delete("/:id", removeFromWatchlist);
export default router;
//# sourceMappingURL=watchlist.routes.js.map