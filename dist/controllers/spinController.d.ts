import { Request, Response } from "express";
export declare const spin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getSpinStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const _default: {
    spin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getSpinStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
export default _default;
//# sourceMappingURL=spinController.d.ts.map