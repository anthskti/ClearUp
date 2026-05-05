import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";
import PAGINATION from "../config/pagination";

export class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // GET /api/users/admin
  async listAdminUsers(req: Request, res: Response): Promise<void> {
    try {
      const limit = Math.min(
        parseInt(req.query.limit as string, 10) || PAGINATION.LIMIT,
        100,
      );
      const offset = parseInt(req.query.offset as string, 10) || PAGINATION.OFFSET;

      const { rows, total } = await this.userRepository.findAllPaginated(
        limit,
        offset,
      );
      res.json({
        users: rows,
        total,
        limit,
        offset,
      });
    } catch (error: any) {
      res.status(500).json({
        error: error.message || "Failed to list users",
      });
    }
  }
}
