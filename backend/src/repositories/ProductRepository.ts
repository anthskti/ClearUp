// Translates storage format to application format

import { Product, ProductCategory, SkinType } from "../types/product";

const ProductModel = require("../models/Product");
export class ProductRepository {
  // Get all products
  async findAll(): Promise<Product[]> {
    try {
      const products = await ProductModel.findAll();
      return products.map((product: any) => this.mapToProductType(product));
    } catch (error: any) {
      throw new Error(`Failed to fetch all products: ${error.message}`);
    }
  }

  // Get products by Category
  async findByCategory(category: ProductCategory): Promise<Product[]> {
    try {
      const products = await ProductModel.findAll({
        where: { category },
      });
      return products.map((product: any) => this.mapToProductType(product));
    } catch (error: any) {
      throw new Error(`Failed to find products by category: ${error.message}`);
    }
  }

  // Get products by Id
  async findById(id: string): Promise<Product | null> {
    try {
      const product = await ProductModel.findByPk(id);
      return product ? this.mapToProductType(product) : null;
    } catch (error: any) {
      throw new Error(`Failed to find product: ${error.message}`);
    }
  }

  private mapToProductType(dbProduct: any): Product {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      brand: dbProduct.brand,
      category: dbProduct.category as ProductCategory,
      skin_types: [dbProduct.skinTypes], // Convert to array
      benefits: dbProduct.benefits || "",
      ingredients: dbProduct.ingredients || "",
      country: dbProduct.country || "",
      image_urls: dbProduct.imageUrls || [],
      average_rating: dbProduct.averageRating || 0,
      review_count: dbProduct.reviewCount || 0,
      tags: dbProduct.tags || [],
      created_at: dbProduct.createdAt,
    };
  }
}
