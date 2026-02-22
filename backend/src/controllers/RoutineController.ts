import { Request, Response } from "express";
import { RoutineService } from "../services/RoutineService";
import PAGINATION from "../config/pagnination";

export class RoutineController {
  private routineService: RoutineService;

  constructor() {
    this.routineService = new RoutineService();
  }

  // GET /api/routines/
  async getAllRoutines(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || PAGINATION.LIMIT;
      const offset = parseInt(req.query.offset as string) || PAGINATION.OFFSET;

      const routines = await this.routineService.getAllRoutines(limit, offset);
      res.json(routines);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/routines/user/:userId
  async getRoutinesByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const routines = await this.routineService.getRoutinesByUserId(userId);
      res.json(routines);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/routines/id/:id
  async getRoutineById(req: Request, res: Response): Promise<void> {
    try {
      const routine = await this.routineService.getRoutineById(req.params.id);
      if (!routine) {
        res.status(404).json({ error: "Routine not found." });
        return;
      }
      res.json(routine);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/routines/id/:id/products
  async getRoutineWithProducts(req: Request, res: Response): Promise<void> {
    try {
      const routine = await this.routineService.getRoutineWithProducts(
        req.params.id,
      );
      if (!routine) {
        res.status(404).json({ error: "Routine not found." });
        return;
      }
      res.json(routine);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/routines
  async createRoutine(req: Request, res: Response): Promise<void> {
    try {
      const routine = await this.routineService.createRoutine(req.body);
      res.status(201).json(routine);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/routines/id/:id
  async updateRoutineById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const routine = await this.routineService.updateRoutine(id, req.body);

      if (!routine) {
        res.status(404).json({ error: "Routine not found" });
        return;
      }

      res.json(routine);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/routines/id/:id
  async deleteRoutineById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await this.routineService.deleteRoutine(id);

      if (!success) {
        res.status(404).json({ error: "Routine not found" });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/routines/:id
  async addProductToRoutine(req: Request, res: Response): Promise<void> {
    try {
      const routineId = parseInt(req.params.id);
      const routineProduct = await this.routineService.addProductToRoutine(
        routineId,
        req.body,
      );
      res.status(201).json(routineProduct);
    } catch (error: any) {
      if (error.message === "Routine not found") {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/routines/:id/product
  async removeProductFromRoutine(req: Request, res: Response): Promise<void> {
    try {
      const routineProductId = parseInt(req.params.id);

      // const userId = parseInt(req.params.userId);

      const success = await this.routineService.removeProductFromRoutine(
        routineProductId,
        // userId
      );

      if (!success) {
        res.status(404).json({ error: "Item not found" });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/routines/:id/product
  async updateProductInRoutine(req: Request, res: Response): Promise<void> {
    try {
      const routineProductId = parseInt(req.params.id);

      const routineProduct = await this.routineService.updateProductInRoutine(
        routineProductId,
        req.body,
      );

      if (!routineProduct) {
        res.status(404).json({ error: "Item not found" });
        return;
      }

      res.json(routineProduct);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/routines/bulk - Create routine with products in bulk
  async createRoutineBulk(req: Request, res: Response): Promise<void> {
    try {
      const routine = await this.routineService.createRoutineWithProducts(
        req.body,
      );
      res.status(201).json(routine);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
