// Translates storage format to application format

import RoutineModel from "../models/Routine";
import ProductModel from "../models/Product";
import RoutineProductModel from "../models/RoutineProduct";
import {
  Routine,
  RoutineWithProducts,
  RoutineProductWithDetails,
} from "../types/routine";

export class RoutineRepository {
  // Get all routines
  async findAll(): Promise<Routine[]> {
    const routines = await RoutineModel.findAll();
    return routines.map((routine: any) => this.mapToRoutineType(routine));
  }

  // GET routines by userId
  async findByUserId(userId: number): Promise<Routine[]> {
    const routines = await RoutineModel.findAll({ where: { userId } });
    return routines.map((routine: any) => this.mapToRoutineType(routine));
  }

  // GET routine (singular) by Id
  async findById(id: string): Promise<Routine | null> {
    const routine = await RoutineModel.findByPk(parseInt(id));
    return routine ? this.mapToRoutineType(routine) : null;
  }

  // GET routine (singular) by Id, outputting the routine's products
  async findByIdWithProducts(id: string): Promise<RoutineWithProducts | null> {
    const routine = await RoutineModel.findByPk(parseInt(id), {
      include: [
        {
          model: RoutineProductModel,
          as: "routineProducts",
          include: [
            {
              model: ProductModel, // Import your ProductModel
              as: "product", // Must match the alias in associations.ts
              attributes: [
                "id",
                "name",
                "brand",
                "price",
                "averageRating",
                "imageUrls",
              ],
            },
          ],
        },
      ],
    });
    return routine ? this.mapToRoutineWithProductsType(routine) : null;
  }

  // POST a single routine
  async create(routineData: {
    name: string;
    description?: string;
    userId: number;
  }): Promise<Routine> {
    const routine = await RoutineModel.create(routineData);
    return this.mapToRoutineType(routine);
  }

  // PUT update a single routine by ID
  async update(
    id: number,
    updates: Partial<{
      name: string;
      description?: string;
    }>
  ): Promise<Routine | null> {
    const [rows, [updatedRoutine]] = await RoutineModel.update(updates, {
      where: { id },
      returning: true,
    });
    return rows > 0 ? this.mapToRoutineType(updatedRoutine) : null;
  }

  // DELETE routine by ID
  async delete(id: number): Promise<boolean> {
    const deleted = await RoutineModel.destroy({ where: { id } });
    return deleted > 0;
  }

  private mapToRoutineType(dbRoutine: any): Routine {
    return {
      id: dbRoutine.id,
      name: dbRoutine.name,
      description: dbRoutine.description,
      userId: dbRoutine.userId,
    };
  }

  private mapToRoutineWithProductsType(dbRoutine: any): RoutineWithProducts {
    return {
      id: dbRoutine.id,
      name: dbRoutine.name,
      description: dbRoutine.description,
      userId: dbRoutine.userId,
      products: dbRoutine.routineProducts
        ? dbRoutine.routineProducts.map(
            (rp: any): RoutineProductWithDetails => ({
              id: rp.id,
              routineId: rp.routineId,
              productId: rp.productId,
              category: rp.category,
              product: rp.product
                ? {
                    id: rp.product.id,
                    name: rp.product.name,
                    brand: rp.product.brand,
                    price: rp.product.price,
                    averageRating: rp.product.averageRating,
                    imageUrls: rp.product.imageUrls,
                  }
                : undefined,
            })
          )
        : undefined,
    };
  }
}
