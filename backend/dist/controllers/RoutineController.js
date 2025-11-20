"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutineController = void 0;
const RoutineService_1 = require("../services/RoutineService");
class RoutineController {
    constructor() {
        this.routineService = new RoutineService_1.RoutineService();
    }
    // GET /api/routines/
    async getAllRoutines(req, res) {
        try {
            const routines = await this.routineService.getAllRoutines();
            res.json(routines);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // GET /api/routines/user/:userId
    async getRoutinesByUserId(req, res) {
        try {
            const userId = parseInt(req.params.userId);
            const routines = await this.routineService.getRoutinesByUserId(userId);
            res.json(routines);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // GET /api/routines/id/:id
    async getRoutineById(req, res) {
        try {
            const routine = await this.routineService.getRoutineById(req.params.id);
            if (!routine) {
                res.status(404).json({ error: "Routine not found." });
                return;
            }
            res.json(routine);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // GET /api/routines/id/:id/products
    async getRoutineWithProducts(req, res) {
        try {
            const routine = await this.routineService.getRoutineWithProducts(req.params.id);
            if (!routine) {
                res.status(404).json({ error: "Routine not found." });
                return;
            }
            res.json(routine);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // POST /api/routines
    async createRoutine(req, res) {
        try {
            const routine = await this.routineService.createRoutine(req.body);
            res.status(201).json(routine);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // PUT /api/routines/id/:id
    async updateRoutineById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const routine = await this.routineService.updateRoutine(id, req.body);
            if (!routine) {
                res.status(404).json({ error: "Routine not found" });
                return;
            }
            res.json(routine);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // DELETE /api/routines/id/:id
    async deleteRoutineById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const success = await this.routineService.deleteRoutine(id);
            if (!success) {
                res.status(404).json({ error: "Routine not found" });
                return;
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // POST /api/routines/:id/products
    async addProductToRoutine(req, res) {
        try {
            const routineId = parseInt(req.params.id);
            const routineProduct = await this.routineService.addProductToRoutine(routineId, req.body);
            res.status(201).json(routineProduct);
        }
        catch (error) {
            if (error.message === "Routine not found") {
                res.status(404).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: error.message });
        }
    }
    // DELETE /api/routines/:id/products/:productId
    async removeProductFromRoutine(req, res) {
        try {
            const routineId = parseInt(req.params.id);
            const productId = parseInt(req.params.productId);
            const success = await this.routineService.removeProductFromRoutine(routineId, productId);
            if (!success) {
                res.status(404).json({ error: "Product not found in routine" });
                return;
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // PUT /api/routines/:id/products/:productId
    async updateProductInRoutine(req, res) {
        try {
            const routineId = parseInt(req.params.id);
            const productId = parseInt(req.params.productId);
            const routineProduct = await this.routineService.updateProductInRoutine(routineId, productId, req.body);
            if (!routineProduct) {
                res.status(404).json({ error: "Product not found in routine" });
                return;
            }
            res.json(routineProduct);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.RoutineController = RoutineController;
//# sourceMappingURL=RoutineController.js.map