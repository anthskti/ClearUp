import { Request, Response } from "express";
import { RoutineService } from "../services/RoutineService";
import PAGINATION from "../config/pagination";

export class RoutineController {
  private routineService: RoutineService;

  constructor() {
    this.routineService = new RoutineService();
  }

  private canAccessUserScopedResource(
    authedUserId: string,
    targetUserId: string,
    role?: string,
  ): boolean {
    return role === "admin" || authedUserId === targetUserId;
  }

  private canManageRoutine(
    authedUserId: string,
    routineOwnerId: string,
    role?: string,
  ): boolean {
    return role === "admin" || authedUserId === routineOwnerId;
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

  // GET /api/routines/admin/stats
  async getAdminStats(req: Request, res: Response): Promise<void> {
    try {
      const days = Math.min(
        Math.max(parseInt((req.query.days as string) || "14", 10), 7),
        60,
      );
      const stats = await this.routineService.getAdminStats(days);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to load admin stats" });
    }
  }

  // GET /api/routines/admin/featured
  async getFeaturedRoutines(req: Request, res: Response): Promise<void> {
    try {
      const featuredRoutines = await this.routineService.getFeaturedRoutines();
      res.json(featuredRoutines);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to load featured routines" });
    }
  }

  // POST /api/routines/admin/featured/:id
  async addFeaturedRoutine(req: Request, res: Response): Promise<void> {
    try {
      const routineId = parseInt(req.params.id, 10);
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      if (Number.isNaN(routineId)) {
        res.status(400).json({ error: "Invalid routine id" });
        return;
      }

      const result = await this.routineService.addFeaturedRoutine(routineId, userId);
      if (result.status === "already_featured") {
        res.status(200).json({ ok: true, message: "Routine is already featured" });
        return;
      }
      res.status(201).json({ ok: true });
    } catch (error: any) {
      if (error.message === "Routine not found") {
        res.status(404).json({ error: "Routine not found" });
        return;
      }
      if (error.message === "Featured guide limit reached (20)") {
        res.status(400).json({ error: "Featured guide limit reached (20)" });
        return;
      }
      res.status(500).json({ error: error.message || "Failed to feature routine" });
    }
  }

  // DELETE /api/routines/admin/featured/:id
  async removeFeaturedRoutine(req: Request, res: Response): Promise<void> {
    try {
      const routineId = parseInt(req.params.id, 10);
      if (Number.isNaN(routineId)) {
        res.status(400).json({ error: "Invalid routine id" });
        return;
      }
      const deleted = await this.routineService.removeFeaturedRoutine(routineId);
      if (!deleted) {
        res.status(404).json({ error: "Routine was not featured" });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to remove featured routine" });
    }
  }

  // GET /api/routines/user/:userId
  async getRoutinesByUserId(req: Request, res: Response): Promise<void> {
    try {
      const authedUserId = req.user?.id;
      const role = req.user?.role;
      if (!authedUserId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const requestedUserId = req.params.userId;
      if (
        requestedUserId &&
        !this.canAccessUserScopedResource(authedUserId, requestedUserId, role)
      ) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const userId = requestedUserId || authedUserId;
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
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const routine = await this.routineService.createRoutine({
        ...req.body,
        userId,
      });
      res.status(201).json(routine);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/routines/id/:id
  async updateRoutineById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user?.id;
      const role = req.user?.role;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const existingRoutine = await this.routineService.getRoutineById(String(id));
      if (!existingRoutine) {
        res.status(404).json({ error: "Routine not found" });
        return;
      }
      if (!this.canManageRoutine(userId, existingRoutine.userId, role)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
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
      if (isNaN(id)) {
        res.status(404).json({ error: "Invalid Routine Id" });
      }
      const userId = req.user?.id;
      const role = req.user?.role;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const existingRoutine = await this.routineService.getRoutineById(String(id));
      if (!existingRoutine) {
        res.status(404).json({ error: "Routine not found" });
        return;
      }
      if (!this.canManageRoutine(userId, existingRoutine.userId, role)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      const success = await this.routineService.deleteRoutine(id, existingRoutine.userId);
      if (!success) {
        res
          .status(404)
          .json({ error: "Routine not found or No Permission to Delete" });
        return;
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete routine" });
    }
  }

  // POST /api/routines/:id
  async addProductToRoutine(req: Request, res: Response): Promise<void> {
    try {
      const routineId = parseInt(req.params.id);
      const userId = req.user?.id;
      const role = req.user?.role;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const routine = await this.routineService.getRoutineById(String(routineId));
      if (!routine) {
        res.status(404).json({ error: "Routine not found" });
        return;
      }
      if (!this.canManageRoutine(userId, routine.userId, role)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
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
      const userId = req.user?.id;
      const role = req.user?.role;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const routineProduct = await this.routineService.getRoutineProductById(
        String(routineProductId),
      );
      if (!routineProduct) {
        res.status(404).json({ error: "Item not found" });
        return;
      }
      const routine = await this.routineService.getRoutineById(
        String(routineProduct.routineId),
      );
      if (!routine || !this.canManageRoutine(userId, routine.userId, role)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const success = await this.routineService.removeProductFromRoutine(
        routineProductId,
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
      const userId = req.user?.id;
      const role = req.user?.role;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const routineProduct = await this.routineService.getRoutineProductById(
        String(routineProductId),
      );
      if (!routineProduct) {
        res.status(404).json({ error: "Item not found" });
        return;
      }
      const routine = await this.routineService.getRoutineById(
        String(routineProduct.routineId),
      );
      if (!routine || !this.canManageRoutine(userId, routine.userId, role)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const updatedRoutineProduct =
        await this.routineService.updateProductInRoutine(
        routineProductId,
        req.body,
        );

      if (!updatedRoutineProduct) {
        res.status(404).json({ error: "Item not found" });
        return;
      }

      res.json(updatedRoutineProduct);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // POST /api/routines/bulk - Create routine with products in bulk
  async createRoutineBulk(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const routine = await this.routineService.createRoutineWithProducts(
        { ...req.body, userId },
      );
      res.status(201).json(routine);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
