import { DataTypes, Model, Optional } from "sequelize";
import Product from "./Product";
import sequelize from "../db";
import { PRODUCT_CATEGORY_VALUES } from "../config/productCategories";

interface RoutineProductAttributes {
  id: number;
  routineId: number;
  productId: number;
  category: string;
  amNote: string | null;
  pmNote: string | null;
  amStepOrder: number | null;
  pmStepOrder: number | null;
}

interface RoutineProductCreationAttributes
  extends Optional<
    RoutineProductAttributes,
    "id" | "amNote" | "pmNote" | "amStepOrder" | "pmStepOrder"
  > {}

class RoutineProduct
  extends Model<RoutineProductAttributes, RoutineProductCreationAttributes>
  implements RoutineProductAttributes
{
  declare id: number;
  declare routineId: number;
  declare productId: number;
  declare category: string;
  declare amNote: string | null;
  declare pmNote: string | null;
  declare amStepOrder: number | null;
  declare pmStepOrder: number | null;
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
    amNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pmNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    amStepOrder: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pmStepOrder: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "routine_products",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["routineId", "productId"],
        name: "routine_products_routine_id_product_id_unique",
      },
    ],
  },
);

export default RoutineProduct;
