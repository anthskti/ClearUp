import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

interface RoutineAttributes {
  id: number;
  name: string;
  description?: string;
  userId: number;
}

interface RoutineCreationAttributes extends Optional<RoutineAttributes, "id"> {}

class Routine
  extends Model<RoutineAttributes, RoutineCreationAttributes>
  implements RoutineAttributes
{
  public id!: number;
  public name!: string;
  public description?: string;
  public userId!: number;
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
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "routines",
  }
);

export default Routine;
