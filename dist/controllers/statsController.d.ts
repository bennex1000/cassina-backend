import { Request, Response } from "express";
export declare const getActiveStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSetBonuses: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getEffectiveStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const _default: {
    getActiveStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getSetBonuses: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getEffectiveStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
export default _default;
//# sourceMappingURL=statsController.d.ts.map