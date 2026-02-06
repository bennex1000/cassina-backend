import { Request, Response } from "express";
export declare const getSnapshot: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const refreshSnapshot: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const _default: {
    getSnapshot: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    refreshSnapshot: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
export default _default;
//# sourceMappingURL=snapshotController.d.ts.map