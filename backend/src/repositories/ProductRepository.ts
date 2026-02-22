// Translates storage format to application format

import ProductModel from "../models/Product";
import { Product, ProductCategory, SkinType } from "../types/product";

export class ProductRepository {
  // Get all products with pagination, infinite scroll
  async findAll(limit: number = 20, offset: number = 0): Promise<Product[]> {
    const products = await ProductModel.findAll({
      limit: limit,
      offset: offset,
      order: [["createdAt", "ASC"]], // Older products to newer
    });
    return products.map((product: any) => this.mapToProductType(product));
  }

  // GET products by category (ex. cleanser, toner) with pagination, infinite scroll
  async findByCategory(
    category: ProductCategory,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Product[]> {
    const products = await ProductModel.findAll({
      where: { category },
      limit: limit,
      offset: offset,
      order: [["createdAt", "ASC"]],
    });
    return products.map((product: any) => this.mapToProductType(product));
  }

  // GET product (Singular) by Id
  async findById(id: string): Promise<Product | null> {
    const product = await ProductModel.findByPk(parseInt(id));
    return product ? this.mapToProductType(product) : null;
  }

  // POST a single product
  async create(productData: {
    name: string;
    brand: string;
    category: ProductCategory;
    labels: string[];
    skinType: SkinType[];
    country: string;
    capacity: string;
    price: number;
    instructions: string[];
    activeIngredient: string;
    ingredients: string;
    imageUrls: string[];
    tags: string[];
  }): Promise<Product> {
    try {
      const product = await ProductModel.create(productData);

      return this.mapToProductType(product);
    } catch (error: any) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new Error("Product already exists.");
      }
      throw error;
    }
  }

  // PUT update a single product by ID
  async update(
    id: number,
    updates: Partial<{
      name: string;
      brand: string;
      category: ProductCategory;
      labels: string[];
      skinType: SkinType[];
      country: string;
      capacity: string;
      price: number;
      instructions: string[];
      activeIngredient: string;
      ingredients?: string;
      averageRating: number;
      reviewCount: number;
      imageUrls: string[];
      tags: string[];
    }>,
  ): Promise<Product | null> {
    const [rows, [updatedProduct]] = await ProductModel.update(updates, {
      where: { id },
      returning: true,
    });
    return rows > 0 ? this.mapToProductType(updatedProduct) : null;
  }

  // DELETE product by ID
  async delete(id: number): Promise<boolean> {
    const deleted = await ProductModel.destroy({ where: { id } });
    return deleted > 0;
  }

  private mapToProductType(dbProduct: any): Product {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      brand: dbProduct.brand,

      category: dbProduct.category,
      labels: dbProduct.labels || [],
      skinType: dbProduct.skinType || [],
      country: dbProduct.country,
      capacity: dbProduct.capacity,
      price: dbProduct.price,

      instructions: dbProduct.instructions || [],
      activeIngredient: dbProduct.activeIngredient,
      ingredients: dbProduct.ingredients,
      imageUrls: dbProduct.imageUrls || [],
      averageRating: dbProduct.averageRating || 0,
      reviewCount: dbProduct.reviewCount || 0,
      tags: dbProduct.tags || [],
    };
  }
}
