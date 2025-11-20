"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProductController_1 = require("../controllers/ProductController");
const router = express_1.default.Router();
const productController = new ProductController_1.ProductController();
router.get("/", (req, res) => productController.getAllProducts(req, res));
router.get("/:category", (req, res) => productController.getProductsByCategory(req, res));
router.get("/id/:id", (req, res) => productController.getProductById(req, res));
router.post("/", (req, res) => productController.createProduct(req, res));
router.put("/id/:id", (req, res) => productController.updateProductbyId(req, res));
router.delete("/id/:id", (req, res) => productController.DeleteProductbyId(req, res));
exports.default = router;
//# sourceMappingURL=productRoutes.js.map