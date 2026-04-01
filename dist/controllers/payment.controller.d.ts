import { Request, Response } from "express";
export declare const createCheckoutSession: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const confirmPayment: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=payment.controller.d.ts.map