"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Routine_1 = __importDefault(require("./models/Routine"));
const Product_1 = __importDefault(require("./models/Product"));
const RoutineProduct_1 = __importDefault(require("./models/RoutineProduct"));
// Import all models
// Note: You might need to adjust import paths based on your structure
const defineAssociations = () => {
    // Many-to-Many relationship with additional metadata
    Routine_1.default.belongsToMany(Product_1.default, {
        through: RoutineProduct_1.default,
        foreignKey: "routineId",
        otherKey: "productId",
        as: "products",
    });
    Product_1.default.belongsToMany(Routine_1.default, {
        through: RoutineProduct_1.default,
        foreignKey: "productId",
        otherKey: "routineId",
        as: "routines",
    });
    // Direct relationships for easier querying
    Routine_1.default.hasMany(RoutineProduct_1.default, {
        foreignKey: "routineId",
        as: "routineProducts",
    });
    RoutineProduct_1.default.belongsTo(Routine_1.default, {
        foreignKey: "routineId",
    });
    RoutineProduct_1.default.belongsTo(Product_1.default, {
        foreignKey: "productId",
    });
    // For testing
    console.log("Database associations defined.");
};
exports.default = defineAssociations;
//# sourceMappingURL=associations.js.map