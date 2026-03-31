import { Request, Response } from "express";
/**
 * Custom type for requests with authenticated users.
 * Extends the standard Express Request.
 */
interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}
export declare const addComment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getComments: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteComment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=comment.controller.d.ts.map