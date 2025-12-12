import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

interface ProductMerchantAttributes {
  id: number;
  productId: number;
  merchantId: number;
  website: string;
  price: number;
  stock: boolean;
  shipping?: string;
  lastUpdated: Date;
}

interface ProductMerchantCreationAttributes
  extends Optional<ProductMerchantAttributes, "id" | "lastUpdated"> {}
class ProductMerchant
  extends Model<ProductMerchantCreationAttributes>
  implements ProductMerchantAttributes
{
  public id!: number;
  public productId!: number;
  public merchantId!: number;
  public website!: string;
  public price!: number;
  public stock!: boolean;
  public shipping?: string;
  public lastUpdated!: Date;
}

ProductMerchant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    merchantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    website: { type: DataTypes.STRING, allowNull: false },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    shipping: {
      type: DataTypes.STRING,
    },
    lastUpdated: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "product_merchants",
    timestamps: true,
    updatedAt: "lastUpdated",
  }
);

export default ProductMerchant;
