import { Model, Optional } from "sequelize";
interface RoutineProductAttributes {
    id: number;
    routineId: number;
    productId: number;
    category: string;
    timeOfDay?: "morning" | "evening" | "both";
    notes?: string;
}
interface RoutineProductCreationAttributes extends Optional<RoutineProductAttributes, "id"> {
}
declare class RoutineProduct extends Model<RoutineProductAttributes, RoutineProductCreationAttributes> implements RoutineProductAttributes {
    id: number;
    routineId: number;
    productId: number;
    category: string;
    timeOfDay?: "morning" | "evening" | "both";
    notes?: string;
}
export default RoutineProduct;
//# sourceMappingURL=RoutineProduct.d.ts.map