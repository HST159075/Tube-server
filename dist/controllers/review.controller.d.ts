import { Request, Response } from "express";
interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}
export declare const getReviewsByMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createReview: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const approveReview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=review.controller.d.ts.map