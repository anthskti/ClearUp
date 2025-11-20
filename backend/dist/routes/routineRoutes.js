"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RoutineController_1 = require("../controllers/RoutineController");
const router = express_1.default.Router();
const routineController = new RoutineController_1.RoutineController();
router.get("/", (req, res) => routineController.getAllRoutines(req, res));
router.get("/user/:userId", (req, res) => routineController.getRoutinesByUserId(req, res));
router.get("/id/:id", (req, res) => routineController.getRoutineById(req, res));
router.get("/id/:id/products", (req, res) => routineController.getRoutineWithProducts(req, res));
router.post("/", (req, res) => routineController.createRoutine(req, res));
router.put("/id/:id", (req, res) => routineController.updateRoutineById(req, res));
router.delete("/id/:id", (req, res) => routineController.deleteRoutineById(req, res));
router.post("/:id/products", (req, res) => routineController.addProductToRoutine(req, res));
router.delete("/:id/products/:productId", (req, res) => routineController.removeProductFromRoutine(req, res));
router.put("/:id/products/:productId", (req, res) => routineController.updateProductInRoutine(req, res));
exports.default = router;
//# sourceMappingURL=routineRoutes.js.map