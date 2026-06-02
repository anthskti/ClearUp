import { DataTypes, Model, Optional } from "sequelize";
import Product from "./Product";
import sequelize from "../db";
import { PRODUCT_CATEGORY_VALUES } from "../config/productCategories";

type TimeOfDay = "AM" | "PM";

interface RoutineProductAttributes {
  id: number;
  routineId: number;
  productId: number;
  category: string;
  timeOfDay: TimeOfDay; 
  stepOrder: number;
  userNote: string | null;
}
interface RoutineProductCreationAttributes
  extends Optional<RoutineProductAttributes, "id" | "userNote"> {}

class RoutineProduct
  extends Model<RoutineProductAttributes, RoutineProductCreationAttributes>
  implements RoutineProductAttributes
{
  declare id: number;
  declare routineId: number;
  declare productId: number;
  declare category: string;
  declare timeOfDay: TimeOfDay;
  declare stepOrder: number;
  declare userNote: string | null;
  declare product?: Product;
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
      type: DataTypes.ENUM(...PRODUCT_CATEGORY_VALUES),
      allowNull: false,
    },
    timeOfDay: {
      type: DataTypes.ENUM('AM', 'PM'),
      allowNull: false,
    },
    stepOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "routine_products",
    timestamps: true,
  }
);

export default RoutineProduct;
