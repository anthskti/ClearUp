import MerchantModel from "../models/Merchant";
import { Merchant } from "../types/merchant";

export class MerchantRepository {
  // GET all merchants
  async findAll(limit: number = 25, offset: number = 0): Promise<Merchant[]> {
    const merchants = await MerchantModel.findAll({
      limit: limit,
      offset: offset,
      order: [["createdAt", "ASC"]],
    });
    return merchants.map((merchant: any) => this.mapToMerchantType(merchant));
  }

  // POST a merchant
  async create(merchantData: {
    name: string;
    logo: string;
  }): Promise<Merchant> {
    try {
      const merchant = await MerchantModel.create(merchantData);
      return this.mapToMerchantType(merchant);
    } catch (error: any) {
      if (error.name === "SequelizeUniqueConstraintError") {
        throw new Error("Merchant already exists.");
      }
      throw error;
    }
  }
  // Update a merchant
  async update(
    id: number,
    updates: Partial<{
      name: string;
      logo: string;
    }>,
  ): Promise<Merchant | null> {
    const [rows, [updatedMerchant]] = await MerchantModel.update(updates, {
      where: { id },
      returning: true,
    });
    return rows > 0 ? this.mapToMerchantType(updatedMerchant) : null;
  }

  // Delete merchant by ID
  async delete(id: number): Promise<boolean> {
    const deleted = await MerchantModel.destroy({ where: { id } });
    return deleted > 0;
  }

  private mapToMerchantType(dbMerchant: any): Merchant {
    return {
      id: dbMerchant.id,
      name: dbMerchant.name,
      logo: dbMerchant.logo,
    };
  }
}
