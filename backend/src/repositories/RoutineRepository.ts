// Translates storage format to application format

import RoutineModel from "../models/Routine";
import ProductModel from "../models/Product";
import RoutineProductModel from "../models/RoutineProduct";
import FeaturedRoutineModel from "../models/FeaturedRoutine";
import UserModel from "../models/User";
import {
  Routine,
  RoutineWithProducts,
  RoutineProductWithDetails,
  GuideRoutineView,
} from "../types/routine";
import {
  FeaturedRoutineEntryRow,
  RoutineDailyCountRow,
  TopAuthorCountRow,
} from "../types/routine-admin";
import PAGINATION from "../config/pagination";
import { Op, QueryTypes, fn, col, literal } from "sequelize";
import { sanitizeSkinTypeTags } from "../types/routineSkinTypeTags";
import type { SkinType } from "../types/product";
import sequelize from "../db";

export class RoutineRepository {
  async countAll(): Promise<number> {
    return RoutineModel.count();
  }

  async countRoutineProductLinks(): Promise<number> {
    return RoutineProductModel.count();
  }

  // Get all routines
  async findAll(
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<Routine[]> {
    const routines = await RoutineModel.findAll({
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
      include: [this.authorInclude()],
    });
    return routines.map((routine: any) => this.mapToRoutineType(routine));
  }

  // GET routines by userId
  async findByUserId(userId: string): Promise<Routine[]> {
    const routines = await RoutineModel.findAll({
      where: { userId },
      include: [this.authorInclude()],
    });
    return routines.map((routine: any) => this.mapToRoutineType(routine));
  }

  //Get Routines for a user with linked products (incl. imageUrls and price)
  async findByUserIdWithProducts(userId: string): Promise<RoutineWithProducts[]> {
    const routines = await RoutineModel.findAll({
      where: { userId },
      include: [
        this.authorInclude(),
        {
          model: RoutineProductModel,
          as: "routineProducts",
          include: [
            {
              model: ProductModel,
              as: "product",
              attributes: [
                "id",
                "name",
                "brand",
                "price",
                "averageRating",
                "imageUrls",
              ],
            },
          ],
        },
      ],
    });
    return routines.map((routine: any) =>
      this.mapToRoutineWithProductsType(routine),
    );
  }

  // GET routine (singular) by Id
  async findById(id: string): Promise<Routine | null> {
    const routine = await RoutineModel.findByPk(parseInt(id), {
      include: [this.authorInclude()],
    });
    return routine ? this.mapToRoutineType(routine) : null;
  }

  // GET routine (singular) by Id, outputting the routine's products
  async findByIdWithProducts(id: string): Promise<RoutineWithProducts | null> {
    const routine = await RoutineModel.findByPk(parseInt(id), {
      include: [
        this.authorInclude(),
        {
          model: RoutineProductModel,
          as: "routineProducts",
          include: [
            {
              model: ProductModel, // Import your ProductModel
              as: "product", // Must match the alias in associations.ts
              attributes: [
                "id",
                "name",
                "brand",
                "price",
                "averageRating",
                "imageUrls",
              ],
            },
          ],
        },
      ],
    });
    return routine ? this.mapToRoutineWithProductsType(routine) : null;
  }

  // GET recent guides with date and count
  async getRecentGuides(since: Date): Promise<RoutineDailyCountRow[]> {
    return RoutineModel.findAll({
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
    }) as unknown as RoutineDailyCountRow[];
  }

  // GET top authors with count
  async getTopAuthors(limit = 5): Promise<TopAuthorCountRow[]> {
    return RoutineModel.findAll({
      attributes: ["userId", [fn("COUNT", col("*")), "count"]],
      group: ["userId"],
      order: [[literal("count"), "DESC"]],
      limit,
      raw: true,
    }) as unknown as TopAuthorCountRow[];
  }

  // GET featured count
  async getFeaturedCount(): Promise<number> {
    return FeaturedRoutineModel.count();
  }

  // GET featured routines entries (limit 20)
  async getFeaturedEntries(limit = 20): Promise<FeaturedRoutineEntryRow[]> {
    return FeaturedRoutineModel.findAll({
      order: [["createdAt", "DESC"]],
      limit,
      raw: true,
    }) as unknown as FeaturedRoutineEntryRow[];
  }

  // GET featured routine by routineId
  async findFeaturedByRoutineId(routineId: number): Promise<any | null> {
    return FeaturedRoutineModel.findOne({ where: { routineId } });
  }

  // POST create a featured routine
  async createFeaturedRoutine(routineId: number, pinnedBy: string): Promise<void> {
    await FeaturedRoutineModel.create({ routineId, pinnedBy });
  }

  // DELETE featured routine by routineId
  async removeFeaturedRoutine(routineId: number): Promise<boolean> {
    const deleted = await FeaturedRoutineModel.destroy({
      where: { routineId },
    });
    return deleted > 0;
  }

  // GET routines by ids
  async findManyByIds(ids: number[]): Promise<Routine[]> {
    if (!ids.length) {
      return [];
    }
    const routines = await RoutineModel.findAll({
      where: { id: ids },
      include: [this.authorInclude()],
    });
    return routines.map((routine: any) => this.mapToRoutineType(routine));
  }

  /**
   * Batched: first up to `limitPerRoutine` distinct product image URLs per routine,
   * in routine-product row order (stable, cheap for featured cards).
   */
  async findPreviewImageUrlsForRoutines(
    routineIds: number[],
    limitPerRoutine: number,
  ): Promise<Map<number, string[]>> {
    const map = new Map<number, string[]>();
    if (!routineIds.length || limitPerRoutine <= 0) {
      return map;
    }
    for (const id of routineIds) {
      map.set(id, []);
    }

    const rows = await RoutineProductModel.findAll({
      where: { routineId: routineIds },
      include: [
        {
          model: ProductModel,
          as: "product",
          attributes: ["imageUrls"],
          required: false,
        },
      ],
      order: [
        ["routineId", "ASC"],
        ["id", "ASC"],
      ],
    });

    for (const row of rows) {
      const rid = row.routineId;
      const bucket = map.get(rid);
      if (!bucket || bucket.length >= limitPerRoutine) {
        continue;
      }
      const urls = (row as { product?: { imageUrls?: unknown } }).product
        ?.imageUrls;
      if (!Array.isArray(urls) || urls.length === 0) {
        continue;
      }
      const firstUrl = urls[0];
      if (typeof firstUrl !== "string" || !firstUrl.trim()) {
        continue;
      }
      if (!bucket.includes(firstUrl)) {
        bucket.push(firstUrl);
      }
    }
    return map;
  }

  async findTotalPricesForRoutineIds(
    routineIds: number[],
  ): Promise<Map<number, number>> {
    const map = new Map<number, number>();
    for (const id of routineIds) {
      map.set(id, 0);
    }
    if (!routineIds.length) {
      return map;
    }
    const rows = (await sequelize.query(
      `
      SELECT rp."routineId" AS "routineId", COALESCE(SUM(p.price), 0)::float AS total
      FROM routine_products rp
      INNER JOIN products p ON p.id = rp."productId"
      WHERE rp."routineId" IN (:routineIds)
      GROUP BY rp."routineId"
      `,
      {
        replacements: { routineIds },
        type: QueryTypes.SELECT,
      },
    )) as { routineId: number; total: number }[];

    for (const row of rows) {
      map.set(Number(row.routineId), Number(row.total) || 0);
    }
    return map;
  }


  // Public guides: only routines whose owner exists in `user` (registered accounts).
  // Random order, optional tag overlap + max total price filters (evaluated in SQL).
  async findGuidesPublic(options: {
    limit: number;
    offset: number;
    tags: SkinType[];
    maxPrice?: number;
  }): Promise<GuideRoutineView[]> {
    const { limit, offset, tags, maxPrice } = options;

    const tagsClause =
      tags.length > 0
        ? `AND r."skinTypeTags" && ARRAY[${tags
            .map((t) => sequelize.escape(t))
            .join(",")}]::varchar[]`
        : "";

    const priceClause =
      maxPrice !== undefined &&
      Number.isFinite(maxPrice) &&
      maxPrice >= 0
        ? `AND (
            SELECT COALESCE(SUM(p.price), 0)
            FROM routine_products rp
            INNER JOIN products p ON p.id = rp."productId"
            WHERE rp."routineId" = r.id
          ) <= :maxPrice`
        : "";

    const replacements: Record<string, unknown> = { limit, offset };
    if (priceClause) {
      replacements.maxPrice = maxPrice;
    }

    const idRows = (await sequelize.query(
      `
      SELECT r.id
      FROM routines r
      INNER JOIN "user" u ON u.id = r."userId"
      WHERE 1 = 1
      ${tagsClause}
      ${priceClause}
      ORDER BY RANDOM()
      LIMIT :limit OFFSET :offset
      `,
      {
        replacements,
        type: QueryTypes.SELECT,
      },
    )) as { id: number }[];

    const orderedIds = idRows.map((row) => row.id);
    if (!orderedIds.length) {
      return [];
    }

    const routines = await this.findManyByIds(orderedIds);
    const orderIndex = new Map(orderedIds.map((id, i) => [id, i]));
    const sorted = [...routines].sort(
      (a, b) => (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0),
    );

    const [previewMap, priceMap] = await Promise.all([
      this.findPreviewImageUrlsForRoutines(orderedIds, 4),
      this.findTotalPricesForRoutineIds(orderedIds),
    ]);

    return sorted.map(
      (r): GuideRoutineView => ({
        routineId: r.id,
        name: r.name,
        description: r.description,
        userId: r.userId,
        author: r.author,
        skinTypeTags: r.skinTypeTags ?? [],
        previewImageUrls: previewMap.get(r.id) ?? [],
        estimatedTotalPrice: priceMap.get(r.id) ?? 0,
      }),
    );
  }

  // POST a single routine
  async create(routineData: {
    name: string;
    description?: string;
    userId: string;
    skinTypeTags?: SkinType[];
  }): Promise<Routine> {
    const routine = await RoutineModel.create({
      ...routineData,
      skinTypeTags: sanitizeSkinTypeTags(routineData.skinTypeTags ?? []),
    });
    return this.mapToRoutineType(routine);
  }

  // PUT update a single routine by ID
  async update(
    id: number,
    updates: Partial<{
      name: string;
      description?: string;
      skinTypeTags: SkinType[];
    }>,
  ): Promise<Routine | null> {
    const [rows, [updatedRoutine]] = await RoutineModel.update(updates, {
      where: { id },
      returning: true,
    });
    return rows > 0 ? this.mapToRoutineType(updatedRoutine) : null;
  }

  // DELETE routine by ID
  async delete(routineId: number, userId: string): Promise<boolean> {
    const deleted = await RoutineModel.destroy({
      where: { id: routineId, userId: userId },
    });
    return deleted > 0;
  }

  private authorInclude() {
    return {
      model: UserModel,
      as: "user",
      attributes: ["id", "name", "email"],
      required: false,
    };
  }

  private mapAuthor(dbRoutine: any): Routine["author"] {
    const u = dbRoutine.user;
    if (!u) return undefined;
    return {
      id: String(u.id),
      name: String(u.name ?? ""),
      email: String(u.email ?? ""),
    };
  }

  private mapToRoutineType(dbRoutine: any): Routine {
    return {
      id: dbRoutine.id,
      name: dbRoutine.name,
      description: dbRoutine.description,
      userId: dbRoutine.userId,
      skinTypeTags: sanitizeSkinTypeTags(dbRoutine.skinTypeTags),
      author: this.mapAuthor(dbRoutine),
    };
  }

  private mapToRoutineWithProductsType(dbRoutine: any): RoutineWithProducts {
    return {
      id: dbRoutine.id,
      name: dbRoutine.name,
      description: dbRoutine.description,
      userId: dbRoutine.userId,
      skinTypeTags: sanitizeSkinTypeTags(dbRoutine.skinTypeTags),
      author: this.mapAuthor(dbRoutine),
      products: dbRoutine.routineProducts
        ? dbRoutine.routineProducts.map(
            (rp: any): RoutineProductWithDetails => ({
              id: rp.id,
              routineId: rp.routineId,
              productId: rp.productId,
              category: rp.category,
              product: rp.product
                ? {
                    id: rp.product.id,
                    name: rp.product.name,
                    brand: rp.product.brand,
                    price: rp.product.price,
                    averageRating: rp.product.averageRating,
                    imageUrls: rp.product.imageUrls,
                  }
                : undefined,
            }),
          )
        : undefined,
    };
  }
}
