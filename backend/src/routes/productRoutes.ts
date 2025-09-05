import express from "express";
import { ProductController } from "../controllers/ProductController";

const router = express.Router();
const productController = new ProductController();

router.get("/", (req, res) => productController.getAllProducts(req, res));
router.get("/:category", (req, res) =>
  productController.getProductsByCategory(req, res)
);
router.get("/id/:id", (req, res) => productController.getProductById(req, res));
router.post("/", (req, res) => productController.createProduct(req, res));
router.put("/id/:id", (req, res) =>
  productController.updateProductbyId(req, res)
);
router.delete("/id/:id", (req, res) =>
  productController.DeleteProductbyId(req, res)
);

export default router;
