import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";
import Merchant from "./Merchant";

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
  declare id: number;
  declare productId: number;
  declare merchantId: number;
  declare website: string;
  declare price: number;
  declare stock: boolean;
  declare shipping?: string;
  declare lastUpdated: Date;
  declare merchant?: Merchant;
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
