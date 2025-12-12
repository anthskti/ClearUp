import { MerchantRepository } from "../repositories/MerchantRepository";
import { Merchant } from "../types/merchant";

export class MerchantService {
  private merchantRepository: MerchantRepository;

  constructor() {
    this.merchantRepository = new MerchantRepository();
  }

  // Standard CRUD Methods

  // GET all merchants
  async getAllMerchants(): Promise<Merchant[]> {
    return this.merchantRepository.findAll();
  }

  // POST a Merchant
  async createMerchant(data: {
    name: string;
    logo: string;
  }): Promise<Merchant> {
    return this.merchantRepository.create(data);
  }

  // PUT update a merchant
  async updateMerchant(
    id: number,
    updates: Partial<{ name: string; logo: string }>
  ): Promise<Merchant | null> {
    return this.merchantRepository.update(id, updates);
  }
  // DELETE a merchant
  async deleteMerchant(id: number): Promise<boolean> {
    return this.merchantRepository.delete(id);
  }
}
