import express from "express";
import { UserController } from "../controllers/UserController";
import { requireAdmin } from "../middleware/requireAuth";

const router = express.Router();
const userController = new UserController();

router.get("/admin", requireAdmin, (req, res) =>
  userController.listAdminUsers(req, res),
);

export default router;
