import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js"; 
import { fromNodeHeaders } from "better-auth/node";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      session?: any;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        
        session = await auth.api.getSession({
          headers: new Headers({
            cookie: `better-auth.session-token=${token}`
          })
        });
      }
    }

    if (!session) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized! Session missing or expired." });
    }

    req.user = session.user;
    req.session = session.session;
    
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed!" });
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden! Admin access only." });
  }
};