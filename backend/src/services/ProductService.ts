import { ProductRepository } from "../repositories/ProductRepository";
import {
  CreateProductInput,
  Product,
  ProductCategory,
  SkinType,
  UpdateProductInput,
} from "../types/product";
import { ProductMerchantRepository } from "../repositories/ProductMerchantRepository";
import parseCsvText from "../scripts/parseCsvText";
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

  // POST batch post products via csv
  // name, brand, category, price, skintype, country, capacity, instructions, activeIngredient, ingredients, imageurls, averageRating
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
      const name = (row.name).trim();
      const brand = (row.brand).trim();

       // Key fields validity checks
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
      // TODO: Figure out skintype enum situation
      const skinType = row.skintype
        ? (row.skintype.split("|").map((v) => v.trim()) as SkinType[])
        : [];
      const country = row.country;
      const category = row.category;
      const capacity = row.capacity;
      const price = Number(row.price || 0);

      const instructions = row.instructions
        ? row.instructions.split("|").map((v) => v.trim())
        : [];
      const ingredients = row.ingredients; // String
      const imageUrls = row.imageurls
        ? row.imageurls.split("|").map((v) => v.trim())
        : [];
      const averageRating = Number(row.averagerating || 0);

      processed += 1;

      try {
        const existing = await this.productRepository.findModelByNameAndBrand(
          name,
          brand,
        );

        if (existing) {
          await existing.update({
            category, // Usually not changed, however might need to be if i add eye cream etc.
            skinType: skinType.length
              ? skinType
              : existing.getDataValue("skinType"),
            capacity: capacity || existing.getDataValue("capacity"),
            country: row.country || existing.getDataValue("country"),
            price: price || existing.getDataValue("price"),
            instructions: instructions.length
              ? instructions
              : existing.getDataValue("instructions"),
            ingredients: row.ingredients || existing.getDataValue("ingredients"),
            imageUrls: imageUrls.length
              ? imageUrls
              : existing.getDataValue("imageUrls"),
            activeIngredient: row.activeingredient || existing.getDataValue("activeIngredient"),
            averageRating: averageRating || existing.getDataValue("averageRating"),
          } as any);
          updated += 1;
        } else {
          await ProductModel.create({
            name,
            brand,
            category,
            skinType,
            country,
            capacity,
            price,
            instructions,
            ingredients,
            imageUrls,
            averageRating,
          } as any);
          created += 1;
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
