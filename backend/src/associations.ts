import sequelize from "./db";
import Routine from "./models/Routine";
import Product from "./models/Product";
import RoutineProduct from "./models/RoutineProduct";
import Merchant from "./models/Merchant";
import ProductMerchant from "./models/ProductMerchant";

// BetterAuth
import User from "./models/User";
import Session from "./models/Session";
import Account from "./models/Account";
import Verification from "./models/Verification";

const defineAssociations = () => {
  User.hasMany(Session, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    as: "sessions",
  });
  Session.belongsTo(User, { foreignKey: "userId" });

  User.hasMany(Account, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    as: "accounts",
  });
  Account.belongsTo(User, { foreignKey: "userId" });

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
