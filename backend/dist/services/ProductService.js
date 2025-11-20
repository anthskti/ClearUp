"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const ProductRepository_1 = require("../repositories/ProductRepository");
class ProductService {
    // for dependency injection
    constructor() {
        this.productRepository = new ProductRepository_1.ProductRepository();
    }
    // GET all products
    async getAllProducts() {
        return this.productRepository.findAll();
    }
    // GET category products (ex. cleanser, toner)
    async getProductsByCategory(category) {
        return this.productRepository.findByCategory(category);
    }
    // GET singlular product (ex. centella ampoule)
    async getProductById(id) {
        return this.productRepository.findById(id);
    }
    // CREATE a product
    async createProduct(productData) {
        return this.productRepository.create(productData);
    }
    // UPDATE single product via ID
    async updateProduct(id, updates) {
        return this.productRepository.update(id, updates);
    }
    // DELETE
    async deleteProduct(id) {
        return this.productRepository.delete(id);
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=ProductService.js.map