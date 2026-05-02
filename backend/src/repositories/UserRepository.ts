import UserModel from "../models/User";
import { Op, fn, col } from "sequelize";
import { BasicUserRow, UserDailyCountRow } from "../types/user";

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
      where: { id: ids },
      attributes: ["id", "name", "email"],
      raw: true,
    }) as unknown as BasicUserRow[];
  }
}
