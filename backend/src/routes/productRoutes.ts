import express, { Router } from "express";
import { ProductController } from "../controllers/ProductController";

const router = express.Router();
const productController = new ProductController();

router.put("/product-merchant/:id", (req, res) =>
  productController.updateProductMerchant(req, res)
);
router.delete("/product-merchant/:id", (req, res) =>
  productController.removeMerchantFromProduct(req, res)
);

// GET for filtering with ?filters=greentea etc
router.get("/", (req, res) => productController.getAllProducts(req, res));
router.post("/", (req, res) => productController.createProduct(req, res));

// GET /api/products/category/
router.get("/category/:category", (req, res) =>
  productController.getProductsByCategory(req, res)
);

// Standard Product CRUD
router.get("/id/:id", (req, res) => productController.getProductById(req, res));
router.put("/id/:id", (req, res) =>
  productController.updateProductbyId(req, res)
);
router.delete("/id/:id", (req, res) =>
  productController.DeleteProductbyId(req, res)
);

router.get("/id/:id/merchants", (req, res) =>
  productController.getMerchantsById(req, res)
);
router.post("/id/:id/merchants", (req, res) =>
  productController.addMerchantByProductId(req, res)
);

export default router;
