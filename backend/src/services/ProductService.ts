import { ProductRepository } from "../repositories/ProductRepository";
import { Product, ProductCategory, SkinType } from "../types/product";

export class ProductService {
  private productRepository: ProductRepository;

  // for dependency injection
  constructor() {
    this.productRepository = new ProductRepository();
  }

  // GET category products (ex. cleanser, toner)
  async getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    return this.productRepository.findByCategory(category);
  }

  // GET singlular product (ex. centella ampoule)
  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  // UPDATE single product via ID
  async updateProduct(
    id: number,
    updates: Partial<{
      name: string;
      brand: string;
      skinTypes: string; // DB expects string, not array
      benefits: string;
      ingredients: string;
      country: string;
      imageUrls: string[];
      tags: string[];
    }>
  ): Promise<Product | null> {
    return this.productRepository.update(id, updates);
  }

  // DELETE
  async deleteProduct(id: number): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}
