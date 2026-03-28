import { Request, Response } from "express";
export declare const getAllMedia: (req: Request, res: Response) => Promise<void>;
export declare const createMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMediaById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const watchMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteMedia: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=media.controller.d.ts.map