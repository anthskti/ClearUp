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
  ingredients?: string; // Not added in frontend yet
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
  public id!: number;
  public name!: string;
  public brand!: string;

  public category!: string;
  public labels!: string[]; // hold filter information (ex. texture, active ingredients, spf on main page too)
  public skinType!: string[];
  public country!: string;
  public capacity!: string;
  public price!: number;

  public instructions!: string[];
  public activeIngredient?: string;
  public ingredients?: string; // All ingredents
  public imageUrls!: string[];
  public averageRating?: number;
  public reviewCount?: number;
  public tags?: string[];
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

    instructions: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
    activeIngredient: { type: DataTypes.STRING },
    ingredients: { type: DataTypes.TEXT },
    imageUrls: DataTypes.ARRAY(DataTypes.TEXT), // Can revert back to STRING. but for safety measure keeping as text
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
        fields: ["activeIngredient"],
        name: "idx_product_active_ingredient",
      },
      {
        fields: ["tags"],
        name: "idx_product_tags",
        using: "GIN",
      },
    ],
  }
);

export default Product;
