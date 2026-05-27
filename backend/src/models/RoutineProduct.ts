import { DataTypes, Model, Optional } from "sequelize";
import Product from "./Product";
import sequelize from "../db";

interface RoutineProductAttributes {
  id: number;
  routineId: number;
  productId: number;
  category: string;
}
interface RoutineProductCreationAttributes
  extends Optional<RoutineProductAttributes, "id"> {}

class RoutineProduct
  extends Model<RoutineProductAttributes, RoutineProductCreationAttributes>
  implements RoutineProductAttributes
{
  declare id: number;
  declare routineId: number;
  declare productId: number;
  declare category: string;
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
      type: DataTypes.ENUM(
        "cleanser",
        "toner",
        "essence",
        "serum",
        // "Eye Cream",
        "moisturizer",
        "sunscreen",
        "other"
      ),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "routine_products",
    timestamps: true,
  }
);

export default RoutineProduct;
