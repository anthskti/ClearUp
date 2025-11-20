import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

interface RoutineProductAttributes {
  id: number;
  routineId: number;
  productId: number;
  category: string;
  timeOfDay?: "morning" | "evening" | "both";
  notes?: string;
}
interface RoutineProductCreationAttributes extends Optional<RoutineProductAttributes, "id"> {}

class RoutineProduct
  extends Model<RoutineProductAttributes, RoutineProductCreationAttributes>
  implements RoutineProductAttributes
{
  public id!: number;
  public routineId!: number;
  public productId!: number;
  public category!: string;
  public timeOfDay?: "morning" | "evening" | "both";
  public notes?: string;
}

RoutineProduct.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    routineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(
        "Cleanser",
        "Toner",
        "Essence",
        "Serum",
        "Eye Cream",
        "Moisturizer",
        "Sunscreen",
        "Other"
      ),
      allowNull: false,
    },
    timeOfDay: {
      type: DataTypes.ENUM("morning", "evening", "both"),
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: "routine_products",
    timestamps: true,
  }
);

export default RoutineProduct;
