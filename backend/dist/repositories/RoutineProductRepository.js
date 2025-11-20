"use strict";
// Translates storage format to application format
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutineProductRepository = void 0;
const RoutineProduct_1 = __importDefault(require("../models/RoutineProduct"));
class RoutineProductRepository {
    // Get all routine products for a routine. Won't be used. 
    async findByRoutineId(routineId) {
        const routineProducts = await RoutineProduct_1.default.findAll({
            where: { routineId },
        });
        return routineProducts.map((rp) => this.mapToRoutineProductType(rp));
    }
    // Get a specific routine product by ID
    async findById(id) {
        const routineProduct = await RoutineProduct_1.default.findByPk(parseInt(id));
        return routineProduct ? this.mapToRoutineProductType(routineProduct) : null;
    }
    // Get routine product by routineId and productId
    // Used to prevent duplicate products in a routine in the backend
    // Not sure if this is needed
    async findByRoutineAndProduct(routineId, productId) {
        const routineProduct = await RoutineProduct_1.default.findOne({
            where: { routineId, productId },
        });
        return routineProduct ? this.mapToRoutineProductType(routineProduct) : null;
    }
    // Add a product to a routine
    // used to prevent duplicate products in the frontend. A little redundant, but can be useful. 
    async create(routineProductData) {
        const existing = await this.findByRoutineAndProduct(routineProductData.routineId, routineProductData.productId);
        if (existing) {
            throw new Error("Product already exists in this routine.");
        }
        const routineProduct = await RoutineProduct_1.default.create(routineProductData);
        return this.mapToRoutineProductType(routineProduct);
    }
    // Update a routine product
    // Will update the routine product's category, time of day, and notes
    async update(id, updates) {
        const [rows, [updatedRoutineProduct]] = await RoutineProduct_1.default.update(updates, {
            where: { id },
            returning: true,
        });
        return rows > 0
            ? this.mapToRoutineProductType(updatedRoutineProduct)
            : null;
    }
    // Update routine product by routineId and productId
    async updateByRoutineAndProduct(routineId, productId, updates) {
        const [rows, [updatedRoutineProduct]] = await RoutineProduct_1.default.update(updates, {
            where: { routineId, productId },
            returning: true,
        });
        return rows > 0
            ? this.mapToRoutineProductType(updatedRoutineProduct)
            : null;
    }
    // Remove a product from a routine
    async delete(id) {
        const deleted = await RoutineProduct_1.default.destroy({ where: { id } });
        return deleted > 0;
    }
    // Remove a product from a routine by routineId and productId
    // Delete a specific product in the routine
    async deleteByRoutineAndProduct(routineId, productId) {
        const deleted = await RoutineProduct_1.default.destroy({
            where: { routineId, productId },
        });
        return deleted > 0;
    }
    mapToRoutineProductType(dbRoutineProduct) {
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
exports.RoutineProductRepository = RoutineProductRepository;
//# sourceMappingURL=RoutineProductRepository.js.map