export declare const auth: import("better-auth").Auth<{
    baseURL: string | undefined;
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    appUrl: string | undefined;
    emailAndPassword: {
        enabled: true;
    };
    trustedOrigins: string[];
    socialProviders: {
        google: {
            clientId: string;
            clientSecret: string;
            prompt: "select_account consent";
            accessType: "offline";
        };
    };
    advanced: {
        crossSubdomainCookies: {
            enabled: boolean;
        };
        defaultCookieAttributes: {
            secure: true;
            httpOnly: true;
            sameSite: "none";
        };
    };
    session: {
        cookieCache: {
            enabled: true;
            maxAge: number;
        };
    };
    user: {
        additionalFields: {
            role: {
                type: "string";
                defaultValue: string;
                required: false;
            };
            phone: {
                type: "string";
                required: false;
            };
            status: {
                type: "string";
                defaultValue: string;
                required: false;
            };
        };
    };
}>;
//# sourceMappingURL=auth.d.ts.map