import { Request, Response } from "express";
import { MerchantService } from "../services/MerchantService";

export class MerchantController {
  private merchantService: MerchantService;

  constructor() {
    this.merchantService = new MerchantService();
  }

  // GET /api/merchants/
  async getAllMerchants(req: Request, res: Response): Promise<void> {
    try {
      const merchants = await this.merchantService.getAllMerchants();
      res.json(merchants);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST api/merchants/
  async createMerchant(req: Request, res: Response): Promise<void> {
    try {
      const merchant = await this.merchantService.createMerchant(req.body);
      res.status(201).json(merchant);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  // PUT /api/merchants/:id
  async updateMerchantbyId(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const merchant = await this.merchantService.updateMerchant(id, req.body);

      if (!merchant) {
        res.status(404).json({ error: "Merchant not found" });
        return;
      }

      res.json(merchant);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/merchants/:id
  async deleteMerchant(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.merchantService.deleteMerchant(id);

      if (!success) {
        res.status(404).json({ error: "Merchant not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
