// Translates storage format to application format

import ProductModel from "../models/Product";
import {
  CreateProductInput,
  Product,
  ProductCategory,
  UpdateProductInput,
} from "../types/product";
import PAGINATION from "../config/pagination";
import { Op, WhereOptions } from "sequelize";
import {
  ProductSearchFilters,
  buildProductFilterWhere,
  buildProductSearchWhere,
} from "../lib/productFilterQuery";

export class ProductRepository {
  // Get all products with pagination, infinite scroll
  async findAll(
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<Product[]> {
    const products = await ProductModel.findAll({
      limit: limit,
      offset: offset,
      order: [["id", "DESC"]], // Older products to newer
    });
    return products.map((product: any) => this.mapToProductType(product));
  }

  // GET products by category (ex. cleanser, toner) with pagination, infinite scroll
  async findByCategory(
    category: ProductCategory,
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<Product[]> {
    const products = await ProductModel.findAll({
      where: { category },
      limit: limit,
      offset: offset,
      order: [["createdAt", "ASC"]],
    });
    return products.map((product: any) => this.mapToProductType(product));
  }

  // Distinct brand names in a category (for filter facets).
  async findDistinctBrandsByCategory(
    category: ProductCategory,
  ): Promise<string[]> {
    const rows = await ProductModel.findAll({
      attributes: ["brand"],
      where: { category },
      group: ["brand"],
      order: [["brand", "ASC"]],
      raw: true,
    });
    return rows
      .map((row) => String((row as { brand?: string }).brand ?? "").trim())
      .filter(Boolean);
  }

  // Distinct brand names across the full catalog. 
  async findDistinctBrands(): Promise<string[]> {
    const rows = await ProductModel.findAll({
      attributes: ["brand"],
      group: ["brand"],
      order: [["brand", "ASC"]],
      raw: true,
    });
    return rows
      .map((row) => String((row as { brand?: string }).brand ?? "").trim())
      .filter(Boolean);
  }

  // GET product (Singular) by Id
  async findById(id: string): Promise<Product | null> {
    const product = await ProductModel.findByPk(parseInt(id));
    return product ? this.mapToProductType(product) : null;
  }

  // POST a single product
  async create(productData: CreateProductInput): Promise<Product> {
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
    updates: UpdateProductInput,
  ): Promise<Product | null> {
    const [rows, [updatedProduct]] = await ProductModel.update(updates, {
      where: { id },
      returning: true,
    });
    return rows > 0 ? this.mapToProductType(updatedProduct) : null;
  }

  async updatePrice(id: number, price: number): Promise<boolean> {
    const [rows] = await ProductModel.update(
      { price },
      {
        where: { id },
      },
    );
    return rows > 0;
  }

  // DELETE product by ID
  async delete(id: number): Promise<boolean> {
    const deleted = await ProductModel.destroy({ where: { id } });
    return deleted > 0;
  }

  // GET / SEARCH products by query (searches name, brand)
  async searchName(
    query: string,
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<Product[]> {
    const searchTerm = `%${query}%`;

    const products = await ProductModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: searchTerm } },
          { brand: { [Op.iLike]: searchTerm } },
        ],
      },
      limit: limit,
      offset: offset,
      order: [["name", "ASC"]],
    });

    return products.map((product: any) => this.mapToProductType(product));
  }

  //  Category listing with optional text search, skin types, brands, and
  //  category-specific attribute filters (mirrors frontend filters.tsx).

  async findByCategoryWithFilters(
    category: ProductCategory,
    filters: ProductSearchFilters,
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<Product[]> {
    const products = await ProductModel.findAll({
      where: buildProductFilterWhere(category, filters),
      limit,
      offset,
      order: [["name", "ASC"]],
    });

    return products.map((product: any) => this.mapToProductType(product));
  }

  // Global catalog listing with skin type / brand / text search (no category).
  async findAllWithFilters(
    filters: ProductSearchFilters,
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<Product[]> {
    return this.searchWithFilters(filters, limit, offset);
  }

  // Global search with optional skin type / brand filters (no category).
  async searchWithFilters(
    filters: ProductSearchFilters,
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<Product[]> {
    const and: WhereOptions[] = [];

    const textWhere = buildProductSearchWhere(filters);
    if (textWhere) and.push(textWhere);

    if (filters.skinTypes?.length) {
      and.push({ skinType: { [Op.overlap]: filters.skinTypes } });
    }

    if (filters.brands?.length) {
      and.push({
        [Op.or]: filters.brands.map((brand) => ({
          brand: { [Op.iLike]: brand },
        })),
      });
    }

    if (!and.length) return [];

    const products = await ProductModel.findAll({
      where: { [Op.and]: and },
      limit,
      offset,
      order: [["name", "ASC"]],
    });

    return products.map((product: any) => this.mapToProductType(product));
  }

  // GET / SEARCH product by name and brand
  async findModelByNameAndBrand(name: string, brand: string): Promise<any | null> {
    return ProductModel.findOne({
      where: {
        name: { [Op.iLike]: name },
        brand: { [Op.iLike]: brand },
      },
    });
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
