// Translates storage format to application format

import ProductModel from "../models/Product";
import { Product, ProductCategory, SkinType } from "../types/product";

export class ProductRepository {
  // Get all products
  async findAll(): Promise<Product[]> {
    const products = await ProductModel.findAll();
    return products.map((product: any) => this.mapToProductType(product));
  }

  // GET products by category (ex. cleanser, toner)
  async findByCategory(category: ProductCategory): Promise<Product[]> {
    const products = await ProductModel.findAll({ where: { category } });
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
    activeIngredient: string[];
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
      activeIngredient: string[];
      ingredients?: string;
      imageUrls: string[];
      tags: string[];
    }>
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
      activeIngredient: dbProduct.activeIngredient || [],
      ingredients: dbProduct.ingredients,
      imageUrls: dbProduct.imageUrls || [],
      averageRating: dbProduct.averageRating || 0,
      reviewCount: dbProduct.reviewCount || 0,
      tags: dbProduct.tags || [],
    };
  }
}
