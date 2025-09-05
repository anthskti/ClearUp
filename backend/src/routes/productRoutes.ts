import express from 'express';
import { ProductController } from '../controllers/productController';

const router = express.Router();
const productController = new ProductController();

router.get('/:category', (req, res) => productController.getProductsByCategory(req, res));
router.get('/product/:id', (req, res) => productController.getProductById(req, res));
router.post('/', (req, res) => productController.createProduct(req, res));
router.put('/:id', (req, res) => productController.updateProductbyId(req, res));
router.delete('/:id', (req, res) => productController.DeleteProductbyId(req, res));

export default router;