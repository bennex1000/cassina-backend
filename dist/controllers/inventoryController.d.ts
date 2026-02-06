import { Request, Response } from "express";
export declare const getInventory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getEquipped: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const equipItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const unequipItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const _default: {
    getInventory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getEquipped: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    equipItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    unequipItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
export default _default;
//# sourceMappingURL=inventoryController.d.ts.map