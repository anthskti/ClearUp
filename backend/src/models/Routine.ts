import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";
import type { SkinType } from "../types/product";

interface RoutineAttributes {
  id: number;
  name: string;
  description?: string;
  userId: string;
  skinTypeTags: SkinType[];
}

interface RoutineCreationAttributes
  extends Optional<RoutineAttributes, "id" | "skinTypeTags"> {}

class Routine
  extends Model<RoutineAttributes, RoutineCreationAttributes>
  implements RoutineAttributes
{
  declare id: number;
  declare name: string;
  declare description?: string; // User Notes 
  declare userId: string;
  declare skinTypeTags: SkinType[];
}

Routine.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT, // Changed to TEXT to support longer JSON strings
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skinTypeTags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: "routines",
  },
);

export default Routine;
