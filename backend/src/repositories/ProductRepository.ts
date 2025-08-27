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

  // GET products by Category
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

  // GET products by Id
  async findById(id: string): Promise<Product | null> {
    try {
      const product = await ProductModel.findByPk(id); // finds by primary key
      return product ? this.mapToProductType(product) : null;
    } catch (error: any) {
      throw new Error(`Failed to find product: ${error.message}`);
    }
  }

  // POST a single product
  async createProduct(productData: {
    // id: number; already auto increpemnted
    name: string;
    brand: string;
    category: ProductCategory;
    skinTypes: string; // DB expects string, not array
    benefits?: string;
    ingredients?: string;
    country?: string;
    imageUrls?: string[];
    averageRating?: number;
    reviewCount?: number;
    tags?: string[];
  }): Promise<Product> {
    try {
      const product = await ProductModel.create(productData);

      return this.mapToProductType(product);
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Product with already exists.");
      }
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  // PUT / UPDATE a single product via ID
  async update(
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
    try {
      const product = await ProductModel.findOneAndUpdate({ id }, updates, {
        new: true,
      });
      return product ? this.mapToProductType(product) : null;
    } catch (error: any) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  // DELETE product by ID
  async delete(id: number): Promise<boolean> {
    try {
      const del = await ProductModel.deleteOne({ id });
      return del.deletedCount > 0;
    } catch (error: any) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  private mapToProductType(dbProduct: any): Product {
    return {
      id: dbProduct.id.toString(), // audo generated in model
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
