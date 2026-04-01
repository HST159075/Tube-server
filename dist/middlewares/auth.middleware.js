import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
export const authMiddleware = async (req, res, next) => {
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
    }
    catch (error) {
        console.error("Auth Middleware Error:", error);
        return res
            .status(401)
            .json({ success: false, message: "Authentication failed!" });
    }
};
export const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "ADMIN") {
        next();
    }
    else {
        return res
            .status(403)
            .json({ success: false, message: "Forbidden! Admin access only." });
    }
};
//# sourceMappingURL=auth.middleware.js.map