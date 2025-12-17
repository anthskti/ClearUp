import express from "express";
import { RoutineController } from "../controllers/RoutineController";

const router = express.Router();
const routineController = new RoutineController();


// ROUTINE 

// GET all routines
router.get("/", (req, res) => routineController.getAllRoutines(req, res));

// GET all routines by User ID
router.get("/user/:userId", (req, res) =>
  routineController.getRoutinesByUserId(req, res)
);

// GET specific Routine by ID
router.get("/id/:id", (req, res) => routineController.getRoutineById(req, res));

// POST a new Routine
router.post("/", (req, res) => routineController.createRoutine(req, res));

// Create a new Routine with products in bulk
router.post("/bulk", (req, res) =>
  routineController.createRoutineBulk(req, res)
);

// PUT update a Routine
router.put("/id/:id", (req, res) =>
  routineController.updateRoutineById(req, res)
);

// DEL a Routine
router.delete("/id/:id", (req, res) =>
  routineController.deleteRoutineById(req, res)
);

// ROUTINE PRODUCTS 

// get a Routine with its products
router.get("/id/:id/products", (req, res) =>
  routineController.getRoutineWithProducts(req, res)
);

// POST a product TO a specific routine
router.post("/id/:id/products", (req, res) =>
  routineController.addProductToRoutine(req, res)
);

// PUT update a specific product within a routine
router.put("/products/:id", (req, res) =>
  routineController.updateProductInRoutine(req, res)
);

// DEL a specific product from a routine using routineproduct key
router.delete("/products/:id", (req, res) =>
  routineController.removeProductFromRoutine(req, res)
);

export default router;
