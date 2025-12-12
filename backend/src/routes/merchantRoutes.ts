import express from "express";
import { MerchantController } from "../controllers/MerchantController";

const router = express.Router();
const merchantController = new MerchantController();

router.get("/", (req, res) => merchantController.getAllMerchants(req, res));
router.post("/", (req, res) => merchantController.createMerchant(req, res));
router.put("/:id", (req, res) =>
  merchantController.updateMerchantbyId(req, res)
);
router.delete("/:id", (req, res) =>
  merchantController.deleteMerchant(req, res)
);

export default router;
