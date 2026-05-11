import UserModel from "../models/User";
import { Op, fn, col } from "sequelize";
import { BasicUserRow, UserDailyCountRow } from "../types/user";

export type AdminUserListRow = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string;
  createdAt: string;
};

export class UserRepository {
  // GET Total Users
  async countAll(): Promise<number> {
    return UserModel.count();
  }

  // GET Recent Users
  async getRecentUsers(since: Date): Promise<UserDailyCountRow[]> {
    return UserModel.findAll({
      where: {
        createdAt: {
          [Op.gte]: since,
        },
      } as any,
      attributes: [
        [fn("DATE_TRUNC", "day", col("createdAt")), "day"],
        [fn("COUNT", col("*")), "count"],
      ],
      group: [fn("DATE_TRUNC", "day", col("createdAt"))],
      raw: true,
    }) as unknown as UserDailyCountRow[];
  }

  // GET with id, return name and email.
  async findBasicByIds(ids: string[]): Promise<BasicUserRow[]> {
    if (!ids.length) {
      return [];
    }
    return UserModel.findAll({
      where: { id: { [Op.in]: ids } },
      attributes: ["id", "name", "email"],
      raw: true,
    }) as unknown as BasicUserRow[];
  }

  async findAllPaginated(
    limit: number,
    offset: number,
  ): Promise<{ rows: AdminUserListRow[]; total: number }> {
    const { rows, count } = await UserModel.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "name",
        "email",
        "emailVerified",
        "role",
        "createdAt",
      ],
      raw: true,
    });

    const mapped = (rows as unknown as AdminUserListRow[]).map((u) => {
      const raw = u.createdAt as unknown;
      const createdAt =
        raw instanceof Date ? raw.toISOString() : String(raw ?? "");
      return { ...u, createdAt };
    });

    return { rows: mapped, total: count };
  }
}
