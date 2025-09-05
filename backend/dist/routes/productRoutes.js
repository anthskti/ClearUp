"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
const productController = new productController_1.ProductController();
router.get('/:category', (req, res) => productController.getProductsByCategory(req, res));
router.get('/product/:id', (req, res) => productController.getProductById(req, res));
router.post('/', (req, res) => productController.createProduct(req, res));
router.put('/:id', (req, res) => productController.updateProductbyId(req, res));
router.delete('/:id', (req, res) => productController.DeleteProductbyId(req, res));
exports.default = router;
//# sourceMappingURL=productRoutes.js.map