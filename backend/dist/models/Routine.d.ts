import { Model, Optional } from "sequelize";
interface RoutineAttributes {
    id: number;
    name: string;
    description?: string;
    userId: number;
}
interface RoutineCreationAttributes extends Optional<RoutineAttributes, "id"> {
}
declare class Routine extends Model<RoutineAttributes, RoutineCreationAttributes> implements RoutineAttributes {
    id: number;
    name: string;
    description?: string;
    userId: number;
}
export default Routine;
//# sourceMappingURL=Routine.d.ts.map