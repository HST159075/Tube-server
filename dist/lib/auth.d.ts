export declare const auth: import("better-auth").Auth<{
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    emailAndPassword: {
        enabled: true;
    };
    trustedOrigins: string[];
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