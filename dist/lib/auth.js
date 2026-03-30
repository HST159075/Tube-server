import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: [
        "https://chine-tube.vercel.app",
        "http://localhost:3000",
    ],
    // ✅ Cross-domain cookie এর জন্য
    advanced: {
        crossSubdomainCookies: {
            enabled: false,
        },
        defaultCookieAttributes: {
            secure: true,
            httpOnly: true,
            sameSite: "none", // ✅ cross-origin cookie allow করবে
            partitioned: true, // CHIPS support
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    }
});
//# sourceMappingURL=auth.js.map