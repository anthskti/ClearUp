"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const Product_1 = __importDefault(require("../models/Product"));
// purpose is to test if postgre db connects with sequelize and properly inputs products
(async () => {
    await db_1.default.sync({ force: true });
    // Insert a test product
    const p = await Product_1.default.create({
        name: "Test Product",
        brand: "Test Brand",
        category: "Cleanser",
        skinTypes: ["oily"],
        benefits: "Test benefits",
        ingredients: "Test ingredients",
        country: "Test Country",
        imageUrls: ["test.jpg"],
        averageRating: 0,
        reviewCount: 0,
        tags: [],
    });
    console.log("Created product:", p.toJSON());
    // Fetch
    const found = await Product_1.default.findAll();
    console.log("All products:", found.map((f) => f.toJSON()));
    process.exit(0);
})();
//# sourceMappingURL=testProduct.js.map