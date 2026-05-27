// Model, Schema for postgreSQL

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

interface ProductAttributes {
  id: number;
  name: string;
  brand: string;

  category: string;
  labels: string[];
  skinType: string[];
  country?: string;
  capacity: string;
  price: number;

  instructions: string[];
  activeIngredient?: string;
  ingredients?: string; 
  imageUrls?: string[];
  averageRating?: number;
  reviewCount?: number;
  tags?: string[];
}

interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  declare id: number;
  declare name: string;
  declare brand: string;

  declare category: string;
  declare labels: string[];
  declare skinType: string[];
  declare country: string;
  declare capacity: string;
  declare price: number;

  declare instructions: string[];
  declare activeIngredient?: string;
  declare ingredients?: string;
  declare imageUrls: string[];
  declare averageRating?: number;
  declare reviewCount?: number;
  declare tags?: string[];
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    brand: { type: DataTypes.STRING, allowNull: false },
    category: {
      type: DataTypes.ENUM(
        "cleanser",
        "toner",
        "essence",
        "serum",
        // "eye-cream",
        "moisturizer",
        "sunscreen",
        "other"
      ),
      allowNull: false,
    },
    labels: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    skinType: {
      type: DataTypes.ARRAY(
        DataTypes.ENUM(
          "oily",
          "dry",
          "combination",
          "sensitive",
          "normal",
          "acne-prone"
        )
      ),
      allowNull: false,
    },
    country: { type: DataTypes.STRING },
    capacity: { type: DataTypes.STRING, defaultValue: "0ml" },
    price: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },

    instructions: { type: DataTypes.ARRAY(DataTypes.TEXT), allowNull: false },
    activeIngredient: { type: DataTypes.STRING },
    ingredients: { type: DataTypes.TEXT },
    imageUrls: DataTypes.ARRAY(DataTypes.TEXT), 
    averageRating: { type: DataTypes.FLOAT, defaultValue: 0 },
    reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    tags: DataTypes.ARRAY(DataTypes.STRING),
  },
  {
    sequelize,
    tableName: "products",
    indexes: [
      {
        fields: ["name"],
        name: "idx_product_name",
      },
      {
        fields: ["brand"],
        name: "idx_product_brand",
      },
      {
        fields: ["category"],
        name: "idx_product_category",
      },
      {
        fields: ["skinType"],
        name: "idx_product_skintype_tags",
        using: "GIN",
      },
    ],
  }
);

export default Product;
