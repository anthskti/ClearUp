import { Request, Response } from "express";
export declare class RoutineController {
    private routineService;
    constructor();
    getAllRoutines(req: Request, res: Response): Promise<void>;
    getRoutinesByUserId(req: Request, res: Response): Promise<void>;
    getRoutineById(req: Request, res: Response): Promise<void>;
    getRoutineWithProducts(req: Request, res: Response): Promise<void>;
    createRoutine(req: Request, res: Response): Promise<void>;
    updateRoutineById(req: Request, res: Response): Promise<void>;
    deleteRoutineById(req: Request, res: Response): Promise<void>;
    addProductToRoutine(req: Request, res: Response): Promise<void>;
    removeProductFromRoutine(req: Request, res: Response): Promise<void>;
    updateProductInRoutine(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=RoutineController.d.ts.map