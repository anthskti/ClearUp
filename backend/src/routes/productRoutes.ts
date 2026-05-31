import express, { Router } from "express";
import { ProductController } from "../controllers/productController";
import { requireAdmin } from "../middleware/requireAuth";
import { parseImportCsvBody } from "../middleware/parseCsvBody";

const router = express.Router();
const productController = new ProductController();

// PRODUCT

// ADMIN endpoints
router.post(
  "/admin/import/csv",
  requireAdmin,
  parseImportCsvBody,
  (req, res) => productController.importProductsCsv(req, res),
);
router.post(
  "/admin/import/prices",
  requireAdmin,
  parseImportCsvBody,
  (req, res) => productController.importPriceUpdatesCsv(req, res),
);

router.put("/product-merchant/:id", requireAdmin, (req, res) =>
  productController.updateProductMerchant(req, res)
);
router.delete("/product-merchant/:id", requireAdmin,(req, res) =>
  productController.removeMerchantFromProduct(req, res)
);

router.get("/brands", (req, res) => productController.getAllBrands(req, res));
// GET for filtering with ?search=...
router.get("/", (req, res) => productController.getAllProducts(req, res));

router.post("/", requireAdmin, (req, res) => productController.createProduct(req, res));

// GET product merchants in batches
router.get("/merchants/batch", (req, res) =>
  productController.getMerchantsBatch(req, res),
);

// GET /api/products/category/
router.get("/category/:category/brands", (req, res) =>
  productController.getBrandsByCategory(req, res),
);
router.get("/category/:category", (req, res) =>
  productController.getProductsByCategory(req, res),
);

// Standard Product CRUD
router.get("/id/:id", (req, res) => productController.getProductById(req, res));
router.put("/id/:id", requireAdmin, (req, res) =>
  productController.updateProductbyId(req, res)
);
router.delete("/id/:id", requireAdmin, (req, res) =>
  productController.DeleteProductbyId(req, res)
);

router.get("/id/:id/merchants", (req, res) =>
  productController.getMerchantsById(req, res)
);
router.post("/id/:id/merchants", requireAdmin, (req, res) =>
  productController.addMerchantByProductId(req, res)
);

export default router;
