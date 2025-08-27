import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  // GET /api/products/:category
  async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const products = await this.productService.getProductsByCategory(
        category as any
      );
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  // GET /api/product/:id
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productService.getProductById(req.params.id);
      if (!product) {
        res.status(404).json({ error: "Product not found." });
        return;
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
