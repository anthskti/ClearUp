// Model, Schema for postgreSQL

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

interface ProductAttributes {
  id: number;
  name: string;
  brand: string;
  category: string;
  skinTypes: string[];
  benefits?: string;
  ingredients?: string;
  country?: string;
  imageUrls?: string[];
  averageRating?: number;
  reviewCount?: number;
  tags?: string[];
  // createdAt?: Date;
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
  public skinTypes!: string[];
  public benefits!: string;
  public ingredients!: string;
  public country!: string;
  public imageUrls!: string[];
  public averageRating?: number;
  public reviewCount?: number;
  public tags?: string[];
  // public createdAt?: Date;
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
    skinTypes: {
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
    benefits: DataTypes.STRING,
    ingredients: DataTypes.STRING,
    country: DataTypes.STRING,
    imageUrls: DataTypes.ARRAY(DataTypes.STRING),
    averageRating: { type: DataTypes.FLOAT, defaultValue: 0 },
    reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    tags: DataTypes.ARRAY(DataTypes.STRING),
    // createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: "products",
    // timestamps: false, will auto do createdAt and updatedAt
  }
);

export default Product;
