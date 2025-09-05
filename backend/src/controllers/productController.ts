import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  // GET /api/products/
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
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

  // POST api/products
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/product/:id
  async updateProductbyId(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productService.updateProduct(id, req.body);

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Delete /api/product/:id
  async DeleteProductbyId(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.productService.deleteProduct(id);

      if (!success) {
        res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
