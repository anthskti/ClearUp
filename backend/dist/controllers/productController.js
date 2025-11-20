"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const ProductService_1 = require("../services/ProductService");
class ProductController {
    constructor() {
        this.productService = new ProductService_1.ProductService();
    }
    // GET /api/products/
    async getAllProducts(req, res) {
        try {
            const products = await this.productService.getAllProducts();
            res.json(products);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // GET /api/products/:category
    async getProductsByCategory(req, res) {
        try {
            const { category } = req.params;
            const products = await this.productService.getProductsByCategory(category);
            res.json(products);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // GET /api/product/:id
    async getProductById(req, res) {
        try {
            const product = await this.productService.getProductById(req.params.id);
            if (!product) {
                res.status(404).json({ error: "Product not found." });
                return;
            }
            res.json(product);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // POST api/products
    async createProduct(req, res) {
        try {
            const product = await this.productService.createProduct(req.body);
            res.status(201).json(product);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // PUT /api/product/:id
    async updateProductbyId(req, res) {
        try {
            const id = parseInt(req.params.id);
            const product = await this.productService.updateProduct(id, req.body);
            if (!product) {
                res.status(404).json({ error: "Product not found" });
                return;
            }
            res.json(product);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // Delete /api/product/:id
    async DeleteProductbyId(req, res) {
        try {
            const id = parseInt(req.params.id);
            const success = await this.productService.deleteProduct(id);
            if (!success) {
                res.status(404).json({ error: "Product not found" });
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=ProductController.js.map