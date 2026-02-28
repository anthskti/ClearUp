import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

interface RoutineAttributes {
  id: number;
  name: string;
  description?: string;
  userId: string;
}

interface RoutineCreationAttributes extends Optional<RoutineAttributes, "id"> {}

class Routine
  extends Model<RoutineAttributes, RoutineCreationAttributes>
  implements RoutineAttributes
{
  public id!: number;
  public name!: string;
  public description?: string; // Routine Description "Anti-ance proofing"
  public userId!: string;
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
  },
  {
    sequelize,
    tableName: "routines",
  },
);

export default Routine;
