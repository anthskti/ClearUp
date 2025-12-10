// Model, Schema for postgreSQL

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

interface ProductAttributes {
  id: number;
  name: string;
  brand: string;

  category: string;
  filter: string[];
  skinType: string[];
  country?: string;
  capacity: string;
  price: number;
  instructions: string[];
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
  public filter!: string[]; // hold filter information (ex. texture, active ingredients, spf on main page too)
  public skinType!: string[];
  public country!: string;
  public capacity!: string;
  public price!: number;

  public instructions!: string[];
  public ingredients!: string; // All ingredents
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
        "Cleanser",
        "Toner",
        "Essence",
        "Serum",
        // "Eye Cream",
        "Moisturizer",
        "Sunscreen",
        "Other"
      ),
      allowNull: false,
    },
    filter: {
      type: DataTypes.STRING,
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
    imageUrls: DataTypes.ARRAY(DataTypes.STRING),
    averageRating: { type: DataTypes.FLOAT, defaultValue: 0 },
    reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    tags: DataTypes.ARRAY(DataTypes.STRING),
  },
  {
    sequelize,
    tableName: "products",
  }
);

export default Product;
