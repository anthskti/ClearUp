import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";
import PAGINATION from "../config/pagination";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  // GET /api/products OR /api/prodcuts?category=cleanser
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || PAGINATION.LIMIT;
      const offset = parseInt(req.query.offset as string) || PAGINATION.OFFSET;
      const searchQuery = req.query.search as string | undefined;

      if (searchQuery) {
        const products = await this.productService.searchProducts(
          searchQuery,
          limit,
          offset,
        );
        res.json(products);
      } else {
        const products = await this.productService.getAllProducts(
          limit,
          offset,
        );
        res.json(products);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/products/:category
  async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || PAGINATION.LIMIT;
      const offset = parseInt(req.query.offset as string) || PAGINATION.OFFSET;
      const { category } = req.params;

      const searchQuery = req.query.search as string | undefined;
      let products;
      if (searchQuery) {
        products = await this.productService.searchProductsInCategory(
          category as any,
          searchQuery,
          limit,
          offset,
        );
      } else {
        products = await this.productService.getProductsByCategory(
          category as any,
          limit,
          offset,
        );
      }
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

  // DELETE /api/product/:id
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

  // GET /api/id/:id/merchants
  async getMerchantsById(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.id);
      const pm = await this.productService.getMerchantsByProductId(productId);
      res.json(pm);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  // POST /api/id/:id/merchants
  async addMerchantByProductId(req: Request, res: Response): Promise<void> {
    try {
      const productId = parseInt(req.params.id);
      const pm = await this.productService.addMerchantByProductId(
        productId,
        req.body,
      );

      res.status(201).json(pm);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/product-merchant/:id
  async updateProductMerchant(req: Request, res: Response): Promise<void> {
    try {
      const productMerchantId = parseInt(req.params.id);
      const pm = await this.productService.updateProductMerchant(
        productMerchantId,
        req.body,
      );
      if (!pm) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      res.json(pm);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  // DELETE /api/product-merchant/:id
  async removeMerchantFromProduct(req: Request, res: Response): Promise<void> {
    try {
      const productMerchantId = parseInt(req.params.id);
      const success =
        await this.productService.removeMerchantFromProduct(productMerchantId);

      if (!success) {
        res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
