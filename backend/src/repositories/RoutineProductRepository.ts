import RoutineProductModel from "../models/RoutineProduct";
import { RoutineProduct } from "../types/routine";
import { ProductCategory } from "../types/product";

export class RoutineProductRepository {
  // GET all products for a specific Routine
  async findByRoutineId(routineId: number): Promise<RoutineProduct[]> {
    const routineProducts = await RoutineProductModel.findAll({
      where: { routineId },
    });
    return routineProducts.map((rp: any) => this.mapToRoutineProductType(rp));
  }

  // GET single routine by id
  async findById(id: string): Promise<RoutineProduct | null> {
    const routineProduct = await RoutineProductModel.findByPk(parseInt(id));
    return routineProduct ? this.mapToRoutineProductType(routineProduct) : null;
  }

  // POST a routine with data
  async create(routineProductData: {
    routineId: number;
    productId: number;
    category: ProductCategory;
    timeOfDay?: "morning" | "evening" | "both";
    notes?: string;
  }): Promise<RoutineProduct> {
    try {
      const routineProduct = await RoutineProductModel.create(
        routineProductData
      );
      return this.mapToRoutineProductType(routineProduct);
    } catch (error: any) {
      if (error.name === "SequilizeUniqueConstraintError") {
        throw new Error("This product already exists in this routine.");
      }
      if (error.name === "SequelizeForeignKeyConstraintError") {
        throw new Error("Routine not found.");
      }
      throw error;
    }
  }

  // PUT updates by routineproduct id
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

  // DELETEs a product from a routine
  async delete(id: number): Promise<boolean> {
    const deleted = await RoutineProductModel.destroy({ where: { id } });
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
