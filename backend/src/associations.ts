// src/associations.ts
import sequelize from "./db";
import Routine from "./models/Routine";
import Product from "./models/Product";
import RoutineProduct from "./models/RoutineProduct";

// Import all models
// Note: You might need to adjust import paths based on your structure

const defineAssociations = () => {
  // Many-to-Many relationship with additional metadata
  Routine.belongsToMany(Product, {
    through: RoutineProduct,
    foreignKey: "routineId",
    otherKey: "productId",
    as: "products",
  });

  Product.belongsToMany(Routine, {
    through: RoutineProduct,
    foreignKey: "productId",
    otherKey: "routineId",
    as: "routines",
  });

  // Direct relationships for easier querying
  Routine.hasMany(RoutineProduct, {
    foreignKey: "routineId",
    as: "routineProducts",
  });

  RoutineProduct.belongsTo(Routine, {
    foreignKey: "routineId",
  });

  RoutineProduct.belongsTo(Product, {
    foreignKey: "productId",
  });
  // For testing
  console.log("Database associations defined.");
};

export default defineAssociations;
