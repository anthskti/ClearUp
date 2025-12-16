// src/associations.ts
import sequelize from "./db";
import Routine from "./models/Routine";
import Product from "./models/Product";
import RoutineProduct from "./models/RoutineProduct";

import Merchant from "./models/Merchant";
import ProductMerchant from "./models/ProductMerchant";

// You might need to adjust import paths based on your structure

const defineAssociations = () => {
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

  Routine.hasMany(RoutineProduct, {
    foreignKey: "routineId",
    as: "routineProducts",
  });

  RoutineProduct.belongsTo(Routine, { foreignKey: "routineId" });
  RoutineProduct.belongsTo(Product, { foreignKey: "productId", 
    as: "product" 
  });

  Merchant.belongsToMany(Product, {
    through: ProductMerchant,
    foreignKey: "merchantId",
    otherKey: "productId",
    as: "products",
  });

  Product.belongsToMany(Merchant, {
    through: ProductMerchant,
    foreignKey: "productId",
    otherKey: "merchantId",
    as: "merchants",
  });

  Product.hasMany(ProductMerchant, {
    foreignKey: "productId",
    as: "productMerchants",
  });
  ProductMerchant.belongsTo(Product, { foreignKey: "productId" });
  ProductMerchant.belongsTo(Merchant, { 
    foreignKey: "merchantId",
    as: "merchant"
  });

  // For testing
  console.log("Database associations defined.");
};

export default defineAssociations;
