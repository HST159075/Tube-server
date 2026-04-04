import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    appUrl: process.env.CLIENT_URL,
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: ["https://tube-client.vercel.app", "http://localhost:3000"],
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectURI: "https://tube-server.onrender.com/api/auth/callback/google",
        },
    },
    advanced: {
        crossSubdomainCookies: {
            enabled: false,
        },
        defaultCookieAttributes: {
            secure: true,
            httpOnly: true,
            sameSite: "none",
            partitioned: true,
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 20 * 60,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false,
            },
            phone: {
                type: "string",
                required: false,
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false,
            },
        },
    },
});
//# sourceMappingURL=auth.js.map