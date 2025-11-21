// Translates storage format to application format

import RoutineProductModel from "../models/RoutineProduct";
import { RoutineProduct } from "../types/routine";
import { ProductCategory } from "../types/product";

export class RoutineProductRepository {
  // Gets all RoutineProduct records for a specific routine. For foreign key to Routine. 
  async findByRoutineId(routineId: number): Promise<RoutineProduct[]> {
    const routineProducts = await RoutineProductModel.findAll({
      where: { routineId },
    });
    return routineProducts.map((rp: any) => this.mapToRoutineProductType(rp));
  }

  // Gets a single RoutineProduct by its internal primary key. 
  async findById(id: string): Promise<RoutineProduct | null> {
    const routineProduct = await RoutineProductModel.findByPk(parseInt(id));
    return routineProduct ? this.mapToRoutineProductType(routineProduct) : null;
  }

  // Get routine product by routineId and productId
  // Used to prevent duplicate products in a routine in the backend
  // Not sure if this is needed
  async findByRoutineAndProduct(
    routineId: number,
    productId: number
  ): Promise<RoutineProduct | null> {
    const routineProduct = await RoutineProductModel.findOne({
      where: { routineId, productId },
    });
    return routineProduct ? this.mapToRoutineProductType(routineProduct) : null;
  }

  // Add a product to a routine
  // used to prevent duplicate products in the frontend. A little redundant, but can be useful. 
  async create(routineProductData: {
    routineId: number;
    productId: number;
    category: ProductCategory;
    timeOfDay?: "morning" | "evening" | "both";
    notes?: string;
  }): Promise<RoutineProduct> {
    const existing = await this.findByRoutineAndProduct(
        routineProductData.routineId,
        routineProductData.productId
      );
      
      if (existing) {
        throw new Error("Product already exists in this routine.");
      }
      
      const routineProduct = await RoutineProductModel.create(routineProductData);
      return this.mapToRoutineProductType(routineProduct);
  }

  // Update a routine product
  // Will update the routine product's category, time of day, and notes
  async update(
    id: number,
    updates: Partial<{
      category: ProductCategory;
      timeOfDay?: "morning" | "evening" | "both";
      notes?: string;
    }>
  ): Promise<RoutineProduct | null> {
    const [rows, [updatedRoutineProduct]] = await RoutineProductModel.update(
      updates,
      {
        where: { id },
        returning: true,
      }
    );
    return rows > 0
      ? this.mapToRoutineProductType(updatedRoutineProduct)
      : null;
  }

  // Update routine product by routineId and productId
  async updateByRoutineAndProduct(
    routineId: number,
    productId: number,
    updates: Partial<{
      category: ProductCategory;
      timeOfDay?: "morning" | "evening" | "both";
      notes?: string;
    }>
  ): Promise<RoutineProduct | null> {
    const [rows, [updatedRoutineProduct]] = await RoutineProductModel.update(
      updates,
      {
        where: { routineId, productId },
        returning: true,
      }
    );
    return rows > 0
      ? this.mapToRoutineProductType(updatedRoutineProduct)
      : null;
  }

  // Remove a product from a routine
  async delete(id: number): Promise<boolean> {
    const deleted = await RoutineProductModel.destroy({ where: { id } });
    return deleted > 0;
  }

  // Remove a product from a routine by routineId and productId
  // Delete a specific product in the routine
  async deleteByRoutineAndProduct(
    routineId: number,
    productId: number
  ): Promise<boolean> {
    const deleted = await RoutineProductModel.destroy({
      where: { routineId, productId },
    });
    return deleted > 0;
  }

  private mapToRoutineProductType(dbRoutineProduct: any): RoutineProduct {
    return {
      id: dbRoutineProduct.id,
      routineId: dbRoutineProduct.routineId,
      productId: dbRoutineProduct.productId,
      category: dbRoutineProduct.category,
      timeOfDay: dbRoutineProduct.timeOfDay,
      notes: dbRoutineProduct.notes,
    };
  }
}

