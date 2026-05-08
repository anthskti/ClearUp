import { RoutineRepository } from "../repositories/RoutineRepository";
import { RoutineProductRepository } from "../repositories/RoutineProductRepository";
import { UserRepository } from "../repositories/UserRepository";
import { Routine, RoutineWithProducts, RoutineProduct, GuideRoutineView } from "../types/routine";
import { AdminStats, FeaturedRoutineView } from "../types/routine-admin";
import { BasicUserRow, UserDailyCountRow } from "../types/user";
import { ProductCategory, SkinType } from "../types/product";
import { sanitizeSkinTypeTags } from "../types/routineSkinTypeTags";
import PAGINATION from "../config/pagination";

export class RoutineService {
  private routineRepository: RoutineRepository;
  private routineProductRepository: RoutineProductRepository;
  private userRepository: UserRepository;

  constructor() {
    this.routineRepository = new RoutineRepository();
    this.routineProductRepository = new RoutineProductRepository();
    this.userRepository = new UserRepository();
  }
  // Standard CRUD Methods

  // GET all routines
  async getAllRoutines(
    limit: number = PAGINATION.LIMIT,
    offset: number = PAGINATION.OFFSET,
  ): Promise<Routine[]> {
    return this.routineRepository.findAll(limit, offset);
  }

  // GET routines by userId (includes products + imageUrls for UI previews)
  async getRoutinesByUserId(userId: string): Promise<RoutineWithProducts[]> {
    return this.routineRepository.findByUserIdWithProducts(userId);
  }

  // GET routine (singular) by Id
  async getRoutineById(id: string): Promise<Routine | null> {
    return this.routineRepository.findById(id);
  }

  // GET routine with its products
  async getRoutineWithProducts(
    id: string,
  ): Promise<RoutineWithProducts | null> {
    return this.routineRepository.findByIdWithProducts(id);
  }

  // GET Admin Statistics
  async getAdminStats(daysInput?: number): Promise<AdminStats> {
    const days = Math.min(Math.max(daysInput || 14, 7), 60);
    const since = new Date();
    since.setDate(since.getDate() - (days - 1));
    since.setHours(0, 0, 0, 0);

    const [totalUsers, totalRoutines, totalRoutineProductLinks, featuredCount] =
      await Promise.all([
        this.userRepository.countAll(),
        this.routineRepository.countAll(),
        this.routineRepository.countRoutineProductLinks(),
        this.routineRepository.getFeaturedCount(),
      ]);

    const [recentUsers, recentRoutines, topAuthorsRaw] = await Promise.all([
      this.userRepository.getRecentUsers(since),
      this.routineRepository.getRecentGuides(since),
      this.routineRepository.getTopAuthors(5),
    ]);
    const topAuthorIds = topAuthorsRaw.map((row) => String(row.userId));
    const topUsers = await this.userRepository.findBasicByIds(topAuthorIds);

    const topUserMap = new Map<string, BasicUserRow>(
      topUsers.map((user) => [user.id, user]),
    );
    const topAuthors = topAuthorsRaw.map((row) => {
      const user = topUserMap.get(row.userId);
      return {
        userId: String(row.userId),
        name: user?.name || "Unknown user",
        email: user?.email || "",
        count: Number(row.count) || 0,
      };
    });

    const seriesByDate = new Map<
      string,
      { date: string; users: number; routines: number }
    >();
    for (let i = 0; i < days; i += 1) {
      const date = new Date(since);
      date.setDate(since.getDate() + i);
      const key = date.toISOString().slice(0, 10);
      seriesByDate.set(key, { date: key, users: 0, routines: 0 });
    }

    for (const row of recentUsers as UserDailyCountRow[]) {
      const key = new Date(row.day).toISOString().slice(0, 10);
      const current = seriesByDate.get(key);
      if (current) current.users = Number(row.count) || 0;
    }
    for (const row of recentRoutines) {
      const key = new Date(row.day).toISOString().slice(0, 10);
      const current = seriesByDate.get(key);
      if (current) current.routines = Number(row.count) || 0;
    }

    return {
      totals: {
        users: totalUsers,
        routines: totalRoutines,
        routineProductLinks: totalRoutineProductLinks,
        featuredRoutines: featuredCount,
      },
      series: Array.from(seriesByDate.values()),
      topAuthors,
    };
  }

  // GET featured routines
  async getFeaturedRoutines(): Promise<FeaturedRoutineView[]> {
    const featuredEntries = await this.routineRepository.getFeaturedEntries(20); // 20 sets the limit
    const routineIds = featuredEntries.map((entry) => Number(entry.routineId));
    const routines = await this.routineRepository.findManyByIds(routineIds);
    const [previewMap, priceMap] = await Promise.all([
      this.routineRepository.findPreviewImageUrlsForRoutines(routineIds, 4),
      this.routineRepository.findTotalPricesForRoutineIds(routineIds),
    ]);

    const routineMap = new Map(
      routines.map((routine) => [routine.id, routine]),
    );
    return featuredEntries
      .map((entry) => {
        const routine = routineMap.get(entry.routineId);
        if (!routine) return null;
        return {
          routineId: routine.id,
          name: routine.name,
          description: routine.description,
          userId: routine.userId,
          pinnedBy: entry.pinnedBy,
          author: routine.author,
          skinTypeTags: routine.skinTypeTags ?? [],
          previewImageUrls: previewMap.get(routine.id) ?? [],
          estimatedTotalPrice: priceMap.get(routine.id) ?? 0,
        };
      })
      .filter(Boolean) as FeaturedRoutineView[];
  }

  // GET Routines (randomly) from registered users
  async getPublicGuides(options: {
    limit: number;
    offset: number;
    tags: SkinType[];
    maxPrice?: number;
  }): Promise<GuideRoutineView[]> {
    return this.routineRepository.findGuidesPublic(options);
  }

  // POST add a featured routine
  async addFeaturedRoutine(
    routineId: number,
    userId: string,
  ): Promise<{
    status: "created" | "already_featured";
  }> {
    const routine = await this.routineRepository.findById(String(routineId));
    if (!routine) {
      throw new Error("Routine not found");
    }

    const alreadyFeatured =
      await this.routineRepository.findFeaturedByRoutineId(routineId);
    if (alreadyFeatured) {
      return { status: "already_featured" };
    }

    const featuredCount = await this.routineRepository.getFeaturedCount();
    if (featuredCount >= 20) {
      throw new Error("Featured guide limit reached (20)");
    }

    await this.routineRepository.createFeaturedRoutine(routineId, userId);
    return { status: "created" };
  }

  async removeFeaturedRoutine(routineId: number): Promise<boolean> {
    return this.routineRepository.removeFeaturedRoutine(routineId);
  }

  // POST a single routine
  async createRoutine(routineData: {
    name: string;
    description?: string;
    userId: string;
  }): Promise<Routine> {
    return this.routineRepository.create(routineData);
  }

  // PUT update a single routine by ID
  async updateRoutine(
    id: number,
    updates: Partial<{
      name: string;
      description?: string;
      skinTypeTags: unknown;
    }>,
  ): Promise<Routine | null> {
    const payload: Partial<{
      name: string;
      description?: string;
      skinTypeTags: ReturnType<typeof sanitizeSkinTypeTags>;
    }> = {};
    if (updates.name !== undefined) {
      payload.name = updates.name;
    }
    if (updates.description !== undefined) {
      payload.description = updates.description;
    }
    if (updates.skinTypeTags !== undefined) {
      payload.skinTypeTags = sanitizeSkinTypeTags(updates.skinTypeTags);
    }
    if (Object.keys(payload).length === 0) {
      return this.routineRepository.findById(String(id));
    }
    return this.routineRepository.update(id, payload);
  }

  // DELETE routine by ID
  async deleteRoutine(id: number, userId: string): Promise<boolean> {
    return this.routineRepository.delete(id, userId);
  }

  // POST Add a product to a routine
  async addProductToRoutine(
    routineId: number,
    productData: {
      productId: number;
      category: ProductCategory;
    },
  ): Promise<RoutineProduct> {
    return this.routineProductRepository.create({
      routineId,
      ...productData,
    });
  }

  // INFO: IDK about this, i was thinking of just overwriting the routine and updating.
  // DELETE a product from a routine
  async removeProductFromRoutine(
    routineProductId: number,
    // userId: number
  ): Promise<boolean> {
    // TODO: security check when Auth is implemented
    /*
    const item = await this.routineProductRepository.findById(routineProductId.toString());
    const routine = await this.routineRepository.findById(item.routineId.toString());
    if (routine.userId !== userId) throw new Error("Unauthorized");
    */
    return this.routineProductRepository.delete(routineProductId);
  }

  // PUT update a routineProducts info in a routine
  async updateProductInRoutine(
    routineProductId: number,
    updates: Partial<{
      category: ProductCategory;
    }>,
  ): Promise<RoutineProduct | null> {
    return this.routineProductRepository.update(routineProductId, updates);
  }

  // GET all products in a routine
  async getRoutineProducts(routineId: number): Promise<RoutineProduct[]> {
    return this.routineProductRepository.findByRoutineId(routineId);
  }

  // GET routine's product by Id; not needed.
  async getRoutineProductById(id: string): Promise<RoutineProduct | null> {
    return this.routineProductRepository.findById(id);
  }

  // POST Create routine with products in bulk
  async createRoutineWithProducts(data: {
    name: string;
    description?: string;
    userId: string;
    skinTypeTags?: unknown;
    items: {
      productId: number;
      category: ProductCategory;
    }[];
  }): Promise<RoutineWithProducts> {
    // Create the routine first
    const routine = await this.routineRepository.create({
      name: data.name,
      description: data.description,
      userId: data.userId,
      skinTypeTags:
        data.skinTypeTags !== undefined
          ? sanitizeSkinTypeTags(data.skinTypeTags)
          : undefined,
    });

    // Then create all the routine products
    const routineProducts = await Promise.all(
      data.items.map((item) =>
        this.routineProductRepository.create({
          routineId: routine.id,
          productId: item.productId,
          category: item.category,
        }),
      ),
    );

    return {
      ...routine,
      products: routineProducts,
    };
  }
}
