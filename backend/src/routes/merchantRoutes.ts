import express from "express";
import { MerchantController } from "../controllers/MerchantController";
import { requireAdmin } from "../middleware/requireAuth";

const router = express.Router();
const merchantController = new MerchantController();

// MERCHANT

router.get("/", (req, res) => merchantController.getAllMerchants(req, res));
router.post("/", requireAdmin,(req, res) => merchantController.createMerchant(req, res));
router.put("/:id", requireAdmin, (req, res) => merchantController.updateMerchantbyId(req, res));
router.delete("/:id", requireAdmin,(req, res) => merchantController.deleteMerchant(req, res));

export default router;
