import { RoutineRepository } from "../repositories/RoutineRepository";
import { RoutineProductRepository } from "../repositories/RoutineProductRepository";
import { Routine, RoutineWithProducts, RoutineProduct } from "../types/routine";
import { ProductCategory } from "../types/product";

export class RoutineService {
  private routineRepository: RoutineRepository;
  private routineProductRepository: RoutineProductRepository;

  // for dependency injection
  constructor() {
    this.routineRepository = new RoutineRepository();
    this.routineProductRepository = new RoutineProductRepository();
  }

  // GET all routines
  async getAllRoutines(): Promise<Routine[]> {
    return this.routineRepository.findAll();
  }

  // GET routines by userId
  async getRoutinesByUserId(userId: number): Promise<Routine[]> {
    return this.routineRepository.findByUserId(userId);
  }

  // GET singular routine by id (ex. "Combination Glass Look Routine")
  async getRoutineById(id: string): Promise<Routine | null> {
    return this.routineRepository.findById(id);
  }

  // GET routine with products
  async getRoutineWithProducts(
    id: string
  ): Promise<RoutineWithProducts | null> {
    return this.routineRepository.findByIdWithProducts(id);
  }

  // CREATE a routine
  async createRoutine(routineData: {
    name: string;
    description?: string;
    userId: number;
  }): Promise<Routine> {
    return this.routineRepository.create(routineData);
  }

  // UPDATE single routine via ID
  async updateRoutine(
    id: number,
    updates: Partial<{
      name: string;
      description?: string;
      userId: number;
    }>
  ): Promise<Routine | null> {
    return this.routineRepository.update(id, updates);
  }

  // DELETE routine
  async deleteRoutine(id: number): Promise<boolean> {
    return this.routineRepository.delete(id);
  }

  // Add a product to a routine
  async addProductToRoutine(
    routineId: number,
    productData: {
      productId: number;
      category: ProductCategory;
      timeOfDay?: "morning" | "evening" | "both";
      notes?: string;
    }
  ): Promise<RoutineProduct> {
    // Verify routine exists
    const routine = await this.routineRepository.findById(
      routineId.toString()
    );
    if (!routine) {
      throw new Error("Routine not found");
    }

    return this.routineProductRepository.create({
      routineId,
      ...productData,
    });
  }

  // Remove a product from a routine
  async removeProductFromRoutine(
    routineId: number,
    productId: number
  ): Promise<boolean> {
    return this.routineProductRepository.deleteByRoutineAndProduct(
      routineId,
      productId
    );
  }

  // Update a product in a routine
  async updateProductInRoutine(
    routineId: number,
    productId: number,
    updates: Partial<{
      category: ProductCategory;
      timeOfDay?: "morning" | "evening" | "both";
      notes?: string;
    }>
  ): Promise<RoutineProduct | null> {
    return this.routineProductRepository.updateByRoutineAndProduct(
      routineId,
      productId,
      updates
    );
  }

  // Get all products in a routine
  async getRoutineProducts(routineId: number): Promise<RoutineProduct[]> {
    return this.routineProductRepository.findByRoutineId(routineId);
  }
}

