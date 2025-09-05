"use strict";
// Model, Schema for postgreSQL
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class Product extends sequelize_1.Model {
}
Product.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    brand: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    category: {
        type: sequelize_1.DataTypes.ENUM("Cleanser", "Toner", "Essence", "Serum", "Eye Cream", "Moisturizer", "Sunscreen", "Other"),
        allowNull: false,
    },
    skinTypes: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.ENUM("oily", "dry", "combination", "sensitive", "normal", "acne-prone")),
        allowNull: false,
    },
    benefits: sequelize_1.DataTypes.STRING,
    ingredients: sequelize_1.DataTypes.STRING,
    country: sequelize_1.DataTypes.STRING,
    imageUrls: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    averageRating: { type: sequelize_1.DataTypes.FLOAT, defaultValue: 0 },
    reviewCount: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    tags: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
}, {
    sequelize: db_1.default,
    tableName: "products",
});
exports.default = Product;
//# sourceMappingURL=Product.js.map