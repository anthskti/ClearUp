"use strict";
// Translates storage format to application format
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const Product_1 = __importDefault(require("../models/Product"));
class ProductRepository {
    // Get all products
    async findAll() {
        const products = await Product_1.default.findAll();
        return products.map((product) => this.mapToProductType(product));
    }
    // GET products by Category
    async findByCategory(category) {
        const products = await Product_1.default.findAll({ where: { category } });
        return products.map((product) => this.mapToProductType(product));
    }
    // GET products by Id
    async findById(id) {
        const product = await Product_1.default.findByPk(parseInt(id));
        return product ? this.mapToProductType(product) : null;
    }
    // POST a single product
    async create(productData) {
        try {
            const product = await Product_1.default.create(productData);
            return this.mapToProductType(product);
        }
        catch (error) {
            if (error.name === "SequelizeUniqueConstraintError") {
                throw new Error("Product with already exists.");
            }
            throw error;
        }
    }
    // PUT / UPDATE a single product via ID
    async update(id, updates) {
        const [rows, [updatedProduct]] = await Product_1.default.update(updates, {
            where: { id },
            returning: true,
        });
        return rows > 0 ? this.mapToProductType(updatedProduct) : null;
    }
    // DELETE product by ID
    async delete(id) {
        const deleted = await Product_1.default.destroy({ where: { id } });
        return deleted > 0;
    }
    mapToProductType(dbProduct) {
        return {
            id: dbProduct.id,
            name: dbProduct.name,
            brand: dbProduct.brand,
            category: dbProduct.category,
            skinTypes: dbProduct.skinTypes || [],
            benefits: dbProduct.benefits,
            ingredients: dbProduct.ingredients,
            country: dbProduct.country,
            imageUrls: dbProduct.imageUrls || [],
            averageRating: dbProduct.averageRating || 0,
            reviewCount: dbProduct.reviewCount || 0,
            tags: dbProduct.tags || [],
        };
    }
}
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=ProductRepository.js.map