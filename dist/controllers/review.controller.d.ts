import { Request, Response } from "express";
export declare const getReviewsByMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createReview: (req: Request, res: Response) => Promise<void>;
export declare const approveReview: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=review.controller.d.ts.map