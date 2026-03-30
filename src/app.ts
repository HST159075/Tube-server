import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import watchlistRoutes from "./routes/watchlist.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import userRoutes from "./routes/user.routes.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: "https://chine-tube.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
  }),
);


app.all("/api/auth/*all", toNodeHandler(auth));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/watchlist", watchlistRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/users", userRoutes);


app.get("/", (req: Request, res: Response) => {
  res.send("CineTube Server is Running! 🚀");
});

// ৬. ৪-৪ রাউট হ্যান্ডলার
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `রাউট পাওয়া যায়নি: ${req.originalUrl} (${req.method})`,
  });
});


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? null : err,
  });
});

export default app;
