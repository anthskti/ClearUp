import MerchantModel from "../models/Merchant";
import {
  CreateMerchantInput,
  Merchant,
  UpdateMerchantInput,
} from "../types/merchant";
import { Op } from "sequelize";

export class MerchantRepository {
  // GET all merchants
  async findAll(): Promise<Merchant[]> {
    const merchants = await MerchantModel.findAll({});
    return merchants.map((merchant: any) => this.mapToMerchantType(merchant));
  }

  // POST a merchant
  async create(merchantData: CreateMerchantInput): Promise<Merchant> {
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
    updates: UpdateMerchantInput,
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

  // GET merhant ID by name
  async findModelByName(name: string): Promise<any | null> {
    return MerchantModel.findOne({
      where: { name: { [Op.iLike]: name } },
      attributes: ['id']
    });
  }

  private mapToMerchantType(dbMerchant: any): Merchant {
    return {
      id: dbMerchant.id,
      name: dbMerchant.name,
      logo: dbMerchant.logo,
    };
  }
}
