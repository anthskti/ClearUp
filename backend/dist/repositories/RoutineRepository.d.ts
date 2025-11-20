import { Routine, RoutineWithProducts } from "../types/routine";
export declare class RoutineRepository {
    findAll(): Promise<Routine[]>;
    findByUserId(userId: number): Promise<Routine[]>;
    findById(id: string): Promise<Routine | null>;
    findByIdWithProducts(id: string): Promise<RoutineWithProducts | null>;
    create(routineData: {
        name: string;
        description?: string;
        userId: number;
    }): Promise<Routine>;
    update(id: number, updates: Partial<{
        name: string;
        description?: string;
    }>): Promise<Routine | null>;
    delete(id: number): Promise<boolean>;
    private mapToRoutineType;
    private mapToRoutineWithProductsType;
}
//# sourceMappingURL=RoutineRepository.d.ts.map