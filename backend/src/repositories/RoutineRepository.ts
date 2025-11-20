// Translates storage format to application format

import RoutineModel from "../models/Routine";
import RoutineProductModel from "../models/RoutineProduct";
import { Routine, RoutineWithProducts } from "../types/routine";

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

  // GET routine by Id
  async findById(id: string): Promise<Routine | null> {
    const routine = await RoutineModel.findByPk(parseInt(id));
    return routine ? this.mapToRoutineType(routine) : null;
  }

  // GET routine by Id, outputting the routine's products
  async findByIdWithProducts(id: string): Promise<RoutineWithProducts | null> {
    const routine = await RoutineModel.findByPk(parseInt(id), {
      include: [
        {
          model: RoutineProductModel,
          as: "routineProducts",
        },
      ],
    });
    return routine ? this.mapToRoutineWithProductsType(routine) : null;
  }

  // findRoutinesByProducts(productIds: number[]); this will be when generally searching, can filter routines by a specifc product.
  // Can implement later

  // POST a single routine
  async create(routineData: {
    name: string;
    description?: string;
    userId: number;
  }): Promise<Routine> {
      const routine = await RoutineModel.create(routineData);
      return this.mapToRoutineType(routine);
  }

  // PUT / UPDATE a single routine via ID
  // Will update the routines name and description
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
        ? dbRoutine.routineProducts.map((rp: any) => ({
            id: rp.id,
            routineId: rp.routineId,
            productId: rp.productId,
            category: rp.category,
            timeOfDay: rp.timeOfDay,
            notes: rp.notes,
          }))
        : undefined,
    };
  }
}

