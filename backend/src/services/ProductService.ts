import { ProductRepository } from "../repositories/ProductRepository";
import {
  CreateProductInput,
  Product,
  ProductCategory,
  UpdateProductInput,
} from "../types/product";
import { ProductMerchantRepository } from "../repositories/ProductMerchantRepository";
import {
  parseCsvText,
  parseCategory,
  parseImageUrls,
  parseInstructions,
  parseLabels,
  parseScraperPrice,
  parseSkinTypes,
  isScraperRowSuccessful,
  SCRAPER_DEFAULT_MERCHANT_NAME,
} from "../lib/csvProductImport";
import ProductModel from "../models/Product";
import ProductMerchantModel from "../models/ProductMerchant";
import {
  Merchant,
  CreateProductMerchantInput,
  ProductMerchant,
  ProductMerchantWithDetails,
  ProductWithMerchants,
  UpdateProductMerchantInput,
} from "../types/merchant";
import { MerchantRepository } from "../repositories/MerchantRepository";
import { CsvImportResult, CsvRowError } from "../types/csv";
import PAGINATION from "../config/pagination";


export class ProductService {
  private productRepository: ProductRepository;
  private productMerchantRepository: ProductMerchantRepository;
  private merchantRepository: MerchantRepository;

  constructor() {
    this.productRepository = new ProductRepository();
    this.productMerchantRepository = new ProductMerchantRepository();
    this.merchantRepository = new MerchantRepository();
  }

  // GET all products
  async getAllProducts(
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<Product[]> {
    return this.productRepository.findAll(limit, offset);
  }

  // GET products by category (ex. cleanser, toner)
  async getProductsByCategory(
    category: ProductCategory,
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<Product[]> {
    return this.productRepository.findByCategory(category, limit, offset);
  }

  // GET product (singlular) by Id
  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  // POST a single product
  async createProduct(productData: CreateProductInput): Promise<Product> {
    return this.productRepository.create(productData);
  }

  // PUT update single product by ID
  async updateProduct(
    id: number,
    updates: UpdateProductInput,
  ): Promise<Product | null> {
    return this.productRepository.update(id, updates);
  }

  // DELETE product by ID
  async deleteProduct(id: number): Promise<boolean> {
    return this.productRepository.delete(id);
  }

  // GET all merchants for a product
  async getMerchantsByProductId(
    productId: number,
  ): Promise<ProductMerchantWithDetails[]> {
    if (!Number.isFinite(productId) || productId <= 0) {
      return [];
    }

    const product = await this.productRepository.findById(String(productId));
    if (!product) {
      return [];
    }

    return this.productMerchantRepository.findByProductId(productId);
  }

  // GET current offers per product for routine/builder views
  // Lazy read: current offers per product for routine/builder views.
  // Keys every requested id (empty array when no rows).
  async getMerchantsGroupedByProductId(
    productIds: number[],
  ): Promise<Record<string, ProductMerchantWithDetails[]>> {
    const unique = [...new Set(productIds)].filter(
      (id) => Number.isFinite(id) && id > 0,
    );
    const out: Record<string, ProductMerchantWithDetails[]> = {};
    for (const id of unique) {
      out[String(id)] = [];
    }
    if (!unique.length) {
      return out;
    }
    const rows =
      await this.productMerchantRepository.findByProductIds(unique);
    for (const row of rows) {
      const key = String(row.productId);
      if (!out[key]) out[key] = [];
      out[key].push(row);
    }
    return out;
  }

  // POST new merchants for a product
  async addMerchantByProductId(
    productId: number,
    merchantData: Omit<CreateProductMerchantInput, "productId">,
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
    updates: UpdateProductMerchantInput,
  ): Promise<ProductMerchant | null> {
    return this.productMerchantRepository.update(productMerchantId, updates);
  }

  // DELETE a Products Merchant
  async removeMerchantFromProduct(productMerchantId: number): Promise<boolean> {
    return this.productMerchantRepository.delete(productMerchantId);
  }

  // GET /SEARCH products by query
  async searchProducts(
    query: string,
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<Product[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }
    return this.productRepository.search(query.trim(), limit, offset);
  }

  // GET / SEARCH products by query within a category
  async searchProductsInCategory(
    category: ProductCategory,
    query: string,
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<Product[]> {
    if (!query || query.trim().length === 0) {
      return this.getProductsByCategory(category, limit, offset);
    }
    const allResults = await this.searchProducts(query, limit * 10, 0); // Get more results to filter
    const filtered = allResults.filter((p) => p.category === category);
    return filtered.slice(offset, offset + limit);
  }

  /** Link scraper `url` + `price` to the default merchant (YesStyle) when present in DB. */
  private async upsertScraperMerchantOffer(
    productId: number,
    website: string,
    price: number,
  ): Promise<void> {
    const merchant = await this.merchantRepository.findModelByName(
      SCRAPER_DEFAULT_MERCHANT_NAME,
    );
    if (!merchant) return;

    const merchantId = Number(merchant.getDataValue("id"));
    const [offer, wasCreated] = await ProductMerchantModel.findOrCreate({
      where: { productId, merchantId },
      defaults: {
        productId,
        merchantId,
        website,
        price,
        stock: true,
        shipping: "",
        lastUpdated: new Date(),
      },
    });

    if (!wasCreated) {
      await offer.update({
        website,
        price,
        lastUpdated: new Date(),
      });
    }
  }

  // POST batch import from datascraper CSV:
  // name, brand, category, labels, skinType, country, capacity, price, instructions,
  // ingredients, imageUrls, averageRating, url, status
  async importProductsCsv(csv: string): Promise<CsvImportResult> {
    const startedAt = Date.now();
    const rows = parseCsvText(csv);
    const errors: CsvRowError[] = [];
    let processed = 0;
    let created = 0;
    let updated = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i += 1) {
      const rowNumber = i + 2; // include header line
      const row = rows[i];
      const name = row.name?.trim() ?? "";
      const brand = row.brand?.trim() ?? "";

      if (!isScraperRowSuccessful(row.status)) {
        skipped += 1;
        errors.push({
          row: rowNumber,
          code: "SCRAPER_STATUS",
          message: `Row skipped (status=${row.status || "unknown"}).`,
        });
        continue;
      }

      if (!name) {
        skipped += 1;
        errors.push({
          row: rowNumber,
          code: "MISSING_NAME",
          message: "Row skipped because product name is missing.",
        });
        continue;
      }
      if (!brand) {
        skipped += 1;
        errors.push({
          row: rowNumber,
          code: "MISSING_BRAND",
          message: "Row skipped because product brand is missing.",
        });
        continue;
      }

      const category = parseCategory(row.category);
      if (!category) {
        skipped += 1;
        errors.push({
          row: rowNumber,
          code: "INVALID_CATEGORY",
          message: `Row skipped because category "${row.category || ""}" is invalid.`,
        });
        continue;
      }

      const labels = parseLabels(row.labels);
      const skinType = parseSkinTypes(row.skintype);
      const country = row.country?.trim() || "";
      const capacity = row.capacity?.trim() || "0ml";
      const price = parseScraperPrice(row.price);
      const instructions = parseInstructions(row.instructions);
      const ingredients = row.ingredients?.trim() || undefined;
      const imageUrls = parseImageUrls(row.imageurls);
      const averageRating = Number(row.averagerating || 0);
      const storeUrl = row.url?.trim() || "";

      processed += 1;

      try {
        const existing = await this.productRepository.findModelByNameAndBrand(
          name,
          brand,
        );

        let productId: number;

        if (existing) {
          await existing.update({
            category,
            labels: labels.length ? labels : existing.getDataValue("labels"),
            skinType: skinType.length
              ? skinType
              : existing.getDataValue("skinType"),
            capacity: capacity || existing.getDataValue("capacity"),
            country: country || existing.getDataValue("country"),
            price: price > 0 ? price : existing.getDataValue("price"),
            instructions: instructions.length
              ? instructions
              : existing.getDataValue("instructions"),
            ingredients:
              ingredients || existing.getDataValue("ingredients"),
            imageUrls: imageUrls.length
              ? imageUrls
              : existing.getDataValue("imageUrls"),
            averageRating:
              averageRating > 0
                ? averageRating
                : existing.getDataValue("averageRating"),
          } as any);
          productId = Number(existing.getDataValue("id"));
          updated += 1;
        } else {
          const createdProduct = await ProductModel.create({
            name,
            brand,
            category,
            labels,
            skinType,
            country,
            capacity,
            price,
            instructions,
            ingredients,
            imageUrls,
            averageRating,
            reviewCount: 0,
          } as any);
          productId = Number(createdProduct.getDataValue("id"));
          created += 1;
        }

        if (storeUrl && price > 0) {
          await this.upsertScraperMerchantOffer(productId, storeUrl, price);
        }
      } catch (error: any) {
        failed += 1;
        errors.push({
          row: rowNumber,
          code: "ROW_PROCESS_FAILED",
          message: error?.message || "Failed to process row.",
        });
      }
    }

    return {
      ok: failed === 0,
      importType: "products",
      message: "CSV product import completed",
      totals: {
        received: rows.length,
        processed,
        created,
        updated,
        skipped,
        failed,
      },
      errors: errors.slice(0, 50),
      durationMs: Date.now() - startedAt,
      processed,
      created,
      updated,
      skipped,
    };
  }

  // POST batch post price updates via csv 
  // name, brand, merchant, price
  async importPriceUpdatesCsv(csv: string): Promise<CsvImportResult> {
    const startedAt = Date.now();
    const rows = parseCsvText(csv);
    const errors: CsvRowError[] = [];
    let processed = 0;
    let created = 0;
    let updated = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i += 1) {
      const rowNumber = i + 2;
      const row = rows[i];
      const productName = row.name;
      const brand = row.brand;
      const merchantName = row.merchant;
      const incomingPrice = Number(row.price);

      if (!productName || !brand || !merchantName || Number.isNaN(incomingPrice)) {
        skipped += 1;
        errors.push({
          row: rowNumber,
          code: "INVALID_REQUIRED_FIELDS",
          message:
            "Row skipped because product_name, brand, merchant, or price was invalid.",
        });
        continue;
      }

      processed += 1;

      try {
        const product = await this.productRepository.findModelByNameAndBrand(
          productName,
          brand,
        );
        const merchant = await this.merchantRepository.findModelByName(merchantName);

        if (!product || !merchant) {
          skipped += 1;
          errors.push({
            row: rowNumber,
            code: "PRODUCT_OR_MERCHANT_NOT_FOUND",
            message:
              "Row skipped because matching product or merchant was not found.",
          });
          continue;
        }

        const productId = Number(product.getDataValue("id"));
        const merchantId = Number(merchant.getDataValue("id"));

        const [productMerchant, wasCreated] =
          await ProductMerchantModel.findOrCreate({
            where: {
              productId: productId,
              merchantId: merchantId,
            },
            defaults: {
              productId: productId,
              merchantId: merchantId,
              website: row.website || "",
              price: incomingPrice,
              stock: true,
              shipping: row.shipping || "",
              lastUpdated: new Date(),
            },
          });

        if (wasCreated) {
          created += 1;
        } else {
          await productMerchant.update({
            price: incomingPrice,
            website: row.website || productMerchant.getDataValue("website"),
            shipping: row.shipping || productMerchant.getDataValue("shipping"),
            lastUpdated: new Date(),
          });
          updated += 1;
        }

        const productOffers = await ProductMerchantModel.findAll({
          where: { productId: productId },
          raw: true,
        });

        const lowestPrice = productOffers.reduce((lowest: number, offer: any) => {
          return Math.min(lowest, Number(offer.price) || Number.MAX_SAFE_INTEGER);
        }, Number.MAX_SAFE_INTEGER);

        if (lowestPrice !== Number.MAX_SAFE_INTEGER) {
          await product.update({ price: lowestPrice });
        }
      } catch (error: any) {
        failed += 1;
        errors.push({
          row: rowNumber,
          code: "ROW_PROCESS_FAILED",
          message: error?.message || "Failed to process row.",
        });
      }
    }

    return {
      ok: failed === 0,
      importType: "prices",
      message: "CSV price update completed",
      totals: {
        received: rows.length,
        processed,
        created,
        updated,
        skipped,
        failed,
      },
      errors: errors.slice(0, 50),
      durationMs: Date.now() - startedAt,
      processed,
      created,
      updated,
      skipped,
      updatedOffers: created + updated,
    };
  }
}
