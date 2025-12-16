import ProductMerchantModel from "../models/ProductMerchant";
import MerchantModel from "../models/Merchant";
import { ProductMerchant, ProductMerchantWithDetails } from "../types/merchant";

export class ProductMerchantRepository {
  // GET all merchants for a product
  async findByProductId(productId: number): Promise<ProductMerchantWithDetails[]> {
    const productMerchants = await ProductMerchantModel.findAll({
      where: { productId },
      include: [
        {
          model: MerchantModel,
          as: "merchant", // Must match the alias in associations.ts
          attributes: ["id", "name", "logo"],
        },
      ],
    });
    return productMerchants.map((pm: any) => this.mapToProductMerchantWithDetailsType(pm));
  }

  // POST new merchant on product list
  async create(productMerchantData: {
    productId: number;
    merchantId: number;
    website: string;
    price: number;
    stock: boolean;
    shipping: string;
  }): Promise<ProductMerchant> {
    try {
      const productMerchant = await ProductMerchantModel.create(
        productMerchantData
      );
      return this.mapToProductMerchantType(productMerchant);
    } catch (error: any) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new Error("This merchant already exists in this product.");
      }
      throw error;
    }
  }

  // PUT update a product-merchant info (ex. price, stock)
  async update(
    id: number,
    updates: Partial<{
      website?: string;
      price?: number;
      stock?: boolean;
      shipping?: string;
    }>
  ): Promise<ProductMerchant | null> {
    const [rows, [updatedProductMerchant]] = await ProductMerchantModel.update(
      updates,
      {
        where: { id },
        returning: true,
      }
    );
    return rows > 0
      ? this.mapToProductMerchantType(updatedProductMerchant)
      : null;
  }

  // DELETE a Products Merchant
  async delete(id: number): Promise<boolean> {
    const deleted = await ProductMerchantModel.destroy({ where: { id } });
    return deleted > 0;
  }

  private mapToProductMerchantType(dbProductMerchant: any): ProductMerchant {
    return {
      id: dbProductMerchant.id,
      productId: dbProductMerchant.productId,
      merchantId: dbProductMerchant.merchantId,
      website: dbProductMerchant.website,
      price: dbProductMerchant.price,
      stock: dbProductMerchant.stock,
      shipping: dbProductMerchant.shipping,
      lastUpdated: dbProductMerchant.lastUpdated,
    };
  }

  private mapToProductMerchantWithDetailsType(dbProductMerchant: any): ProductMerchantWithDetails {
    return {
      id: dbProductMerchant.id,
      productId: dbProductMerchant.productId,
      merchantId: dbProductMerchant.merchantId,
      website: dbProductMerchant.website,
      price: dbProductMerchant.price,
      stock: dbProductMerchant.stock,
      shipping: dbProductMerchant.shipping,
      lastUpdated: dbProductMerchant.lastUpdated,
      merchant: dbProductMerchant.merchant
        ? {
            id: dbProductMerchant.merchant.id,
            name: dbProductMerchant.merchant.name,
            logo: dbProductMerchant.merchant.logo,
          }
        : undefined,
    };
  }
}
