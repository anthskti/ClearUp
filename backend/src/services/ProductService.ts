import { ProductRepository } from "../repositories/ProductRepository";
import { Product, ProductCategory, SkinType } from "../types/product";
import { ProductMerchantRepository } from "../repositories/ProductMerchantRepository";
import {
  Merchant,
  ProductMerchant,
  ProductWithMerchants,
} from "../types/merchant";

export class ProductService {
  private productRepository: ProductRepository;
  private productMerchantRepository: ProductMerchantRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.productMerchantRepository = new ProductMerchantRepository();
  }

  // GET all products
  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  // GET products by category (ex. cleanser, toner)
  async getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    return this.productRepository.findByCategory(category);
  }

  // GET product (singlular) by Id
  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  // POST a single product
  async createProduct(productData: {
    name: string;
    brand: string;
    category: ProductCategory;
    labels: string[];
    skinType: SkinType[];
    country: string;
    capacity: string;
    price: number;
    instructions: string[];
    activeIngredient: string[];
    ingredients: string;
    imageUrls: string[];
    averageRating: number;
    reviewCount: number;
    tags: string[];
  }): Promise<Product> {
    return this.productRepository.create(productData);
  }

  // PUT update single product by ID
  async updateProduct(
    id: number,
    updates: Partial<{
      name?: string;
      brand?: string;
      category?: ProductCategory;
      labels?: string[];
      skinType?: SkinType[];
      country?: string;
      capacity?: string;
      price?: number;
      instructions?: string[];
      activeIngredient?: string[];
      ingredients?: string;
      imageUrls?: string[];
      tags?: string[];
    }>
  ): Promise<Product | null> {
    return this.productRepository.update(id, updates);
  }

  // DELETE product by ID
  async deleteProduct(id: number): Promise<boolean> {
    return this.productRepository.delete(id);
  }

  // GET all merchants for a product
  async getMerchantsByProductId(productId: number): Promise<ProductMerchant[]> {
    // Check if product exists first?
    const product = await this.productRepository.findById(productId.toString());
    if (!product) {
      throw new Error("Product not found");
    }

    return this.productMerchantRepository.findByProductId(productId);
  }

  // POST new merchants for a product
  async addMerchantByProductId(
    productId: number,
    merchantData: {
      merchantId: number;
      website: string;
      price: number;
      stock: boolean;
      shipping: string;
    }
  ): Promise<ProductMerchant> {
    const product = await this.productRepository.findById(productId.toString());
    if (!product) {
      throw new Error("Product not found");
    }
    return this.productMerchantRepository.create({
      productId: productId,
      ...merchantData,
    });
  }

  // PUT update a product-merchant info
  async updateProductMerchant(
    productMerchantId: number,
    updates: Partial<{ website: string; price: number; stock: boolean }>
  ): Promise<ProductMerchant | null> {
    return this.productMerchantRepository.update(productMerchantId, updates);
  }

  // DELETE a Products Merchant
  async removeMerchantFromProduct(productMerchantId: number): Promise<boolean> {
    return this.productMerchantRepository.delete(productMerchantId);
  }
}
