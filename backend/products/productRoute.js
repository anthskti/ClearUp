// The Rest Notations
// Like @GetMapping

const express = require("express");
const router = express.Router();
const productController = require("./productController");

// GET all products
router.get("/", productController.getAllProducts);

// GET product by ID
router.get("/:id", productController.getProductById);

// POST new product
router.post("/", productController.createProduct);

module.exports = router;