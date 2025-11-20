"use strict";
// Translates storage format to application format
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutineRepository = void 0;
const Routine_1 = __importDefault(require("../models/Routine"));
const RoutineProduct_1 = __importDefault(require("../models/RoutineProduct"));
class RoutineRepository {
    // Get all routines
    async findAll() {
        const routines = await Routine_1.default.findAll();
        return routines.map((routine) => this.mapToRoutineType(routine));
    }
    // GET routines by userId
    async findByUserId(userId) {
        const routines = await Routine_1.default.findAll({ where: { userId } });
        return routines.map((routine) => this.mapToRoutineType(routine));
    }
    // GET routine by Id
    async findById(id) {
        const routine = await Routine_1.default.findByPk(parseInt(id));
        return routine ? this.mapToRoutineType(routine) : null;
    }
    // GET routine by Id, outputting the routine's products
    async findByIdWithProducts(id) {
        const routine = await Routine_1.default.findByPk(parseInt(id), {
            include: [
                {
                    model: RoutineProduct_1.default,
                    as: "routineProducts",
                },
            ],
        });
        return routine ? this.mapToRoutineWithProductsType(routine) : null;
    }
    // findRoutinesByProducts(productIds: number[]); this will be when generally searching, can filter routines by a specifc product.
    // Can implement later
    // POST a single routine
    async create(routineData) {
        const routine = await Routine_1.default.create(routineData);
        return this.mapToRoutineType(routine);
    }
    // PUT / UPDATE a single routine via ID
    // Will update the routines name and description
    async update(id, updates) {
        const [rows, [updatedRoutine]] = await Routine_1.default.update(updates, {
            where: { id },
            returning: true,
        });
        return rows > 0 ? this.mapToRoutineType(updatedRoutine) : null;
    }
    // DELETE routine by ID
    async delete(id) {
        const deleted = await Routine_1.default.destroy({ where: { id } });
        return deleted > 0;
    }
    mapToRoutineType(dbRoutine) {
        return {
            id: dbRoutine.id,
            name: dbRoutine.name,
            description: dbRoutine.description,
            userId: dbRoutine.userId,
        };
    }
    mapToRoutineWithProductsType(dbRoutine) {
        return {
            id: dbRoutine.id,
            name: dbRoutine.name,
            description: dbRoutine.description,
            userId: dbRoutine.userId,
            products: dbRoutine.routineProducts
                ? dbRoutine.routineProducts.map((rp) => ({
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
exports.RoutineRepository = RoutineRepository;
//# sourceMappingURL=RoutineRepository.js.map