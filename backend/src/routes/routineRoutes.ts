import express from "express";
import { RoutineController } from "../controllers/RoutineController";

const router = express.Router();
const routineController = new RoutineController();

router.get("/", (req, res) => routineController.getAllRoutines(req, res));
router.get("/user/:userId", (req, res) =>
  routineController.getRoutinesByUserId(req, res)
);
router.get("/id/:id", (req, res) => routineController.getRoutineById(req, res));
router.get("/id/:id/products", (req, res) =>
  routineController.getRoutineWithProducts(req, res)
);
router.post("/", (req, res) => routineController.createRoutine(req, res));
router.put("/id/:id", (req, res) =>
  routineController.updateRoutineById(req, res)
);
router.delete("/id/:id", (req, res) =>
  routineController.deleteRoutineById(req, res)
);
// Routine Products
router.post("/:id/products", (req, res) =>
  routineController.addProductToRoutine(req, res)
);
router.delete("/:id/products/:productId", (req, res) =>
  routineController.removeProductFromRoutine(req, res)
);
router.put("/:id/products/:productId", (req, res) =>
  routineController.updateProductInRoutine(req, res)
);

export default router;
