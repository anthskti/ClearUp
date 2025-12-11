import { RoutineRepository } from "../repositories/RoutineRepository";
import { RoutineProductRepository } from "../repositories/RoutineProductRepository";
import { Routine, RoutineWithProducts, RoutineProduct } from "../types/routine";
import { ProductCategory } from "../types/product";

export class RoutineService {
  private routineRepository: RoutineRepository;
  private routineProductRepository: RoutineProductRepository;

  constructor() {
    this.routineRepository = new RoutineRepository();
    this.routineProductRepository = new RoutineProductRepository();
  }
  // Standard CRUD Methods

  // GET all routines
  async getAllRoutines(): Promise<Routine[]> {
    return this.routineRepository.findAll();
  }

  // GET routines by userId
  async getRoutinesByUserId(userId: number): Promise<Routine[]> {
    return this.routineRepository.findByUserId(userId);
  }

  // GET routine (singular) by Id
  async getRoutineById(id: string): Promise<Routine | null> {
    return this.routineRepository.findById(id);
  }

  // GET routine with its products
  async getRoutineWithProducts(
    id: string
  ): Promise<RoutineWithProducts | null> {
    return this.routineRepository.findByIdWithProducts(id);
  }

  // POST a single routine
  async createRoutine(routineData: {
    name: string;
    description?: string;
    userId: number;
  }): Promise<Routine> {
    return this.routineRepository.create(routineData);
  }

  // PUT update a single routine by ID
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

  // DELETE routine by ID
  async deleteRoutine(id: number): Promise<boolean> {
    return this.routineRepository.delete(id);
  }

  // POST Add a product to a routine
  async addProductToRoutine(
    routineId: number,
    productData: {
      productId: number;
      category: ProductCategory;
      timeOfDay?: "morning" | "evening" | "both";
      notes?: string;
    }
  ): Promise<RoutineProduct> {
    return this.routineProductRepository.create({
      routineId,
      ...productData,
    });
  }

  // DELETE a product from a routine
  async removeProductFromRoutine(
    routineProductId: number,
    userId: number
  ): Promise<boolean> {
    // TODO: security check when Auth is implemented
    /*
    const item = await this.routineProductRepository.findById(routineProductId.toString());
    const routine = await this.routineRepository.findById(item.routineId.toString());
    if (routine.userId !== userId) throw new Error("Unauthorized");
    */
    return this.routineProductRepository.delete(routineProductId);
  }

  // PUT update a routineProducts info in a routine
  async updateProductInRoutine(
    routineProductId: number,
    updates: Partial<{
      category: ProductCategory;
      timeOfDay?: "morning" | "evening" | "both";
      notes?: string;
    }>
  ): Promise<RoutineProduct | null> {
    return this.routineProductRepository.update(routineProductId, updates);
  }

  //GET all products in a routine
  async getRoutineProducts(routineId: number): Promise<RoutineProduct[]> {
    return this.routineProductRepository.findByRoutineId(routineId);
  }
}
