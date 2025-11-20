import { Routine, RoutineWithProducts, RoutineProduct } from "../types/routine";
import { ProductCategory } from "../types/product";
export declare class RoutineService {
    private routineRepository;
    private routineProductRepository;
    constructor();
    getAllRoutines(): Promise<Routine[]>;
    getRoutinesByUserId(userId: number): Promise<Routine[]>;
    getRoutineById(id: string): Promise<Routine | null>;
    getRoutineWithProducts(id: string): Promise<RoutineWithProducts | null>;
    createRoutine(routineData: {
        name: string;
        description?: string;
        userId: number;
    }): Promise<Routine>;
    updateRoutine(id: number, updates: Partial<{
        name: string;
        description?: string;
        userId: number;
    }>): Promise<Routine | null>;
    deleteRoutine(id: number): Promise<boolean>;
    addProductToRoutine(routineId: number, productData: {
        productId: number;
        category: ProductCategory;
        timeOfDay?: "morning" | "evening" | "both";
        notes?: string;
    }): Promise<RoutineProduct>;
    removeProductFromRoutine(routineId: number, productId: number): Promise<boolean>;
    updateProductInRoutine(routineId: number, productId: number, updates: Partial<{
        category: ProductCategory;
        timeOfDay?: "morning" | "evening" | "both";
        notes?: string;
    }>): Promise<RoutineProduct | null>;
    getRoutineProducts(routineId: number): Promise<RoutineProduct[]>;
}
//# sourceMappingURL=RoutineService.d.ts.map