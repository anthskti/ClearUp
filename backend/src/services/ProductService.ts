import { ProductRepository } from "../repositories/ProductRepository";
import { Product, ProductCategory, SkinType } from "../types/product";

export class ProductService {
  private productRepository: ProductRepository;

  // for dependency injection
  constructor() {
    this.productRepository = new ProductRepository();
  }

  // GET all products
  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  // GET category products (ex. cleanser, toner)
  async getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    return this.productRepository.findByCategory(category);
  }

  // GET singlular product (ex. centella ampoule)
  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  // CREATE a product
  async createProduct(productData: {
    // id: number; already auto increpemnted
    name: string;
    brand: string;
    category: ProductCategory;
    skinTypes: SkinType[];
    benefits: string;
    ingredients: string;
    country: string;
    imageUrls: string[];
    tags: string[];
  }): Promise<Product> {
    return this.productRepository.create(productData);
  }

  // UPDATE single product via ID
  async updateProduct(
    id: number,
    updates: Partial<{
      name: string;
      brand: string;
      category: ProductCategory;
      skinTypes: SkinType[];
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
