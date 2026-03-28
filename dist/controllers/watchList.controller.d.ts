import { Request, Response } from "express";
export declare const addToWatchlist: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyWatchlist: (req: Request, res: Response) => Promise<void>;
export declare const removeFromWatchlist: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=watchList.controller.d.ts.map