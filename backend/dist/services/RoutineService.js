"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutineService = void 0;
const RoutineRepository_1 = require("../repositories/RoutineRepository");
const RoutineProductRepository_1 = require("../repositories/RoutineProductRepository");
class RoutineService {
    // for dependency injection
    constructor() {
        this.routineRepository = new RoutineRepository_1.RoutineRepository();
        this.routineProductRepository = new RoutineProductRepository_1.RoutineProductRepository();
    }
    // GET all routines
    async getAllRoutines() {
        return this.routineRepository.findAll();
    }
    // GET routines by userId
    async getRoutinesByUserId(userId) {
        return this.routineRepository.findByUserId(userId);
    }
    // GET singular routine by id (ex. "Combination Glass Look Routine")
    async getRoutineById(id) {
        return this.routineRepository.findById(id);
    }
    // GET routine with products
    async getRoutineWithProducts(id) {
        return this.routineRepository.findByIdWithProducts(id);
    }
    // CREATE a routine
    async createRoutine(routineData) {
        return this.routineRepository.create(routineData);
    }
    // UPDATE single routine via ID
    async updateRoutine(id, updates) {
        return this.routineRepository.update(id, updates);
    }
    // DELETE routine
    async deleteRoutine(id) {
        return this.routineRepository.delete(id);
    }
    // Add a product to a routine
    async addProductToRoutine(routineId, productData) {
        // Verify routine exists
        const routine = await this.routineRepository.findById(routineId.toString());
        if (!routine) {
            throw new Error("Routine not found");
        }
        return this.routineProductRepository.create({
            routineId,
            ...productData,
        });
    }
    // Remove a product from a routine
    async removeProductFromRoutine(routineId, productId) {
        return this.routineProductRepository.deleteByRoutineAndProduct(routineId, productId);
    }
    // Update a product in a routine
    async updateProductInRoutine(routineId, productId, updates) {
        return this.routineProductRepository.updateByRoutineAndProduct(routineId, productId, updates);
    }
    // Get all products in a routine
    async getRoutineProducts(routineId) {
        return this.routineProductRepository.findByRoutineId(routineId);
    }
}
exports.RoutineService = RoutineService;
//# sourceMappingURL=RoutineService.js.map