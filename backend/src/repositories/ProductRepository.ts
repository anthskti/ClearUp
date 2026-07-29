// Translates storage format to application format

import ProductModel from "../models/Product";
import type {
  CreateProductInput,
  Product,
  ProductCategory,
  ProductListResult,
  UpdateProductInput,
} from "../types/product";
import PAGINATION from "../config/pagination";
import { Op } from "sequelize";
import {
  ProductSearchFilters,
  buildProductFilterWhere,
  buildGlobalProductFilterWhere,
  hasProductListFilters,
} from "../lib/productFilterQuery";
import { normalizeImageUrls } from "../lib/csvProductImport";

export class ProductRepository {
  // Get all products with pagination, infinite scroll
  async findAll(
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<Product[]> {
    const result = await this.findAllAndTotal(limit, offset);
    return result.products;
  }

  async findAllAndTotal(
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<ProductListResult> {
    const [rows, total] = await Promise.all([
      ProductModel.findAll({
        limit,
        offset,
        order: [["id", "DESC"]],
      }),
      ProductModel.count(),
    ]);
    return {
      products: rows.map((product: any) => this.mapToProductType(product)),
      total,
    };
  }

  // GET products by category (ex. cleanser, toner) with pagination, infinite scroll
  async findByCategory(
    category: ProductCategory,
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<Product[]> {
    const result = await this.findByCategoryAndTotal(category, limit, offset);
    return result.products;
  }

  async findByCategoryAndTotal(
    category: ProductCategory,
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<ProductListResult> {
    const where = { category };
    const [rows, total] = await Promise.all([
      ProductModel.findAll({
        where,
        limit,
        offset,
        order: [["createdAt", "ASC"]],
      }),
      ProductModel.count({ where }),
    ]);
    return {
      products: rows.map((product: any) => this.mapToProductType(product)),
      total,
    };
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

  // GET product id to live catalog category (for routine join overwrite)
  async findCategoriesByIds(
    ids: number[],
  ): Promise<Map<number, ProductCategory>> {
    const unique = [...new Set(ids)].filter(
      (id) => Number.isFinite(id) && id > 0,
    );
    const map = new Map<number, ProductCategory>();
    if (!unique.length) return map;

    const rows = await ProductModel.findAll({
      where: { id: { [Op.in]: unique } },
      attributes: ["id", "category"],
    });
    for (const row of rows) {
      map.set(
        Number(row.getDataValue("id")),
        row.getDataValue("category") as ProductCategory,
      );
    }
    return map;
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
    const result = await this.findByCategoryWithFiltersAndTotal(
      category,
      filters,
      limit,
      offset,
    );
    return result.products;
  }

  async findByCategoryWithFiltersAndTotal(
    category: ProductCategory,
    filters: ProductSearchFilters,
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<ProductListResult> {
    const where = buildProductFilterWhere(category, filters);
    const [rows, total] = await Promise.all([
      ProductModel.findAll({
        where,
        limit,
        offset,
        order: [["name", "ASC"]],
      }),
      ProductModel.count({ where }),
    ]);

    return {
      products: rows.map((product: any) => this.mapToProductType(product)),
      total,
    };
  }

  async countByCategory(category: ProductCategory): Promise<number> {
    return ProductModel.count({ where: { category } });
  }

  async countAll(): Promise<number> {
    return ProductModel.count();
  }

  // Global catalog listing with skin type / brand / text search (no category).
  async findAllWithFilters(
    filters: ProductSearchFilters,
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<Product[]> {
    const result = await this.findAllWithFiltersAndTotal(filters, limit, offset);
    return result.products;
  }

  async findAllWithFiltersAndTotal(
    filters: ProductSearchFilters,
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<ProductListResult> {
    return this.searchWithFiltersAndTotal(filters, limit, offset);
  }

  // Global search with optional skin type / brand / price filters (no category).
  async searchWithFilters(
    filters: ProductSearchFilters,
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<Product[]> {
    const result = await this.searchWithFiltersAndTotal(filters, limit, offset);
    return result.products;
  }

  async searchWithFiltersAndTotal(
    filters: ProductSearchFilters,
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<ProductListResult> {
    if (!hasProductListFilters(filters)) {
      return { products: [], total: 0 };
    }

    const where = buildGlobalProductFilterWhere(filters);

    const [rows, total] = await Promise.all([
      ProductModel.findAll({
        where,
        limit,
        offset,
        order: [["name", "ASC"]],
      }),
      ProductModel.count({ where }),
    ]);

    return {
      products: rows.map((product: any) => this.mapToProductType(product)),
      total,
    };
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
      imageUrls: normalizeImageUrls(dbProduct.imageUrls),
      averageRating: dbProduct.averageRating || 0,
      reviewCount: dbProduct.reviewCount || 0,
      tags: dbProduct.tags || [],
    };
  }
}
