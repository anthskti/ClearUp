import { RoutineProduct } from "../types/routine";
import { ProductCategory } from "../types/product";
export declare class RoutineProductRepository {
    findByRoutineId(routineId: number): Promise<RoutineProduct[]>;
    findById(id: string): Promise<RoutineProduct | null>;
    findByRoutineAndProduct(routineId: number, productId: number): Promise<RoutineProduct | null>;
    create(routineProductData: {
        routineId: number;
        productId: number;
        category: ProductCategory;
        timeOfDay?: "morning" | "evening" | "both";
        notes?: string;
    }): Promise<RoutineProduct>;
    update(id: number, updates: Partial<{
        category: ProductCategory;
        timeOfDay?: "morning" | "evening" | "both";
        notes?: string;
    }>): Promise<RoutineProduct | null>;
    updateByRoutineAndProduct(routineId: number, productId: number, updates: Partial<{
        category: ProductCategory;
        timeOfDay?: "morning" | "evening" | "both";
        notes?: string;
    }>): Promise<RoutineProduct | null>;
    delete(id: number): Promise<boolean>;
    deleteByRoutineAndProduct(routineId: number, productId: number): Promise<boolean>;
    private mapToRoutineProductType;
}
//# sourceMappingURL=RoutineProductRepository.d.ts.map