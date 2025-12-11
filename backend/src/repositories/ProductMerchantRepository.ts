import ProductMerchantModel from "../models/ProductMerchant";
import { ProductMerchant } from "../types/merchant";

export class ProductMerchantRepository {
  // GET all merchants for a product
  async findByProductId(productId: number): Promise<ProductMerchant[]> {
    const productMerchants = await ProductMerchantModel.findAll({
      where: { productId },
    });
    return productMerchants.map((pm: any) => this.mapToProductMerchantType(pm));
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
}
