import express, { Application, Request, Response } from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import mediaRoutes from "./routes/media.routes";
import reviewRoutes from "./routes/review.routes";
import watchlistRoutes from "./routes/watchlist.routes";
import paymentRoutes from "./routes/payment.routes";
import userRoutes from "./routes/user.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app: Application = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("CineTube Server is Running! 🚀");
});

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/watchlist", watchlistRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/users", userRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `রাউট পাওয়া যায়নি: ${req.originalUrl} (${req.method})`,
  });
});

app.use((err: any, req: Request, res: Response, next: any) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong!",
    errorDetails: err,
  });
});

export default app;
