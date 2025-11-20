"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class RoutineProduct extends sequelize_1.Model {
}
RoutineProduct.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    routineId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    category: {
        type: sequelize_1.DataTypes.ENUM("Cleanser", "Toner", "Essence", "Serum", "Eye Cream", "Moisturizer", "Sunscreen", "Other"),
        allowNull: false,
    },
    timeOfDay: {
        type: sequelize_1.DataTypes.ENUM("morning", "evening", "both"),
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
    },
}, {
    sequelize: db_1.default,
    tableName: "routine_products",
    timestamps: true,
});
exports.default = RoutineProduct;
//# sourceMappingURL=RoutineProduct.js.map