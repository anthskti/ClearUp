import sequelize from "../db";
import { Op, WhereOptions } from "sequelize";
import { parseSkinTypes } from "./csvProductImport";
import type { ProductCategory, SkinType } from "../types/product";

// Mirrors frontend `constants/filters.tsx` → ProductListClient `labelIndexMap`.
// Category-specific filter ids map to a `labels[]` index.

export const LABEL_FILTER_INDEX: Record<string, number> = {
  texture: 0,
  benefits: 0,
  effect: 0,
  spf: 0,
  activeIngredient: 0, 
  concentration: 1,
  finish: 1,
  filter: 2,
};

// Allowed filter query keys per category (from filters.tsx specificFilters).
export const CATEGORY_FILTER_IDS: Record<ProductCategory, readonly string[]> = {
  cleanser: ["texture"],
  toner: ["benefits"],
  essence: ["effect"],
  serum: ["activeIngredient", "concentration"],
  moisturizer: ["texture", "finish"],
  sunscreen: ["spf", "finish", "filter"],
  other: [],
};

export interface ProductSearchFilters {
  query?: string;
  skinTypes?: SkinType[];
  brands?: string[];
  attributeFilters?: Record<string, string[]>;
}

function parseCsvParam(raw: unknown): string[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  return [
    ...new Set(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ];
}

// Parse `skinType` query param 
export function parseSkinTypesParam(raw: unknown): SkinType[] {
  if (typeof raw !== "string") return [];
  return parseSkinTypes(raw);
}


// Build filters from Express query object.
// Supports: search, skinType, brands, and category-specific keys from filters.tsx.
export function parseProductListQuery(
  query: Record<string, unknown>,
  category?: ProductCategory,
): ProductSearchFilters {
  const searchRaw = query.search;
  const filters: ProductSearchFilters = {
    query: typeof searchRaw === "string" ? searchRaw : undefined,
    skinTypes: parseSkinTypesParam(query.skinType),
    brands: parseCsvParam(query.brands),
    attributeFilters: {},
  };

  const filterIds = category
    ? [...CATEGORY_FILTER_IDS[category]]
    : Object.keys(LABEL_FILTER_INDEX);

  for (const filterId of filterIds) {
    const values = parseCsvParam(query[filterId]);
    if (values.length > 0) {
      filters.attributeFilters![filterId] = values;
    }
  }

  return filters;
}

export function hasProductListFilters(filters: ProductSearchFilters): boolean {
  if (filters.query?.trim()) return true;
  if (filters.skinTypes?.length) return true;
  if (filters.brands?.length) return true;
  if (
    filters.attributeFilters &&
    Object.values(filters.attributeFilters).some((v) => v.length > 0)
  ) {
    return true;
  }
  return false;
}

function labelAtIndexCondition(
  index: number,
  values: string[],
): WhereOptions {
  const pgIndex = index + 1; // PostgreSQL arrays are 1-indexed
  return {
    [Op.or]: values.map((value) =>
      sequelize.where(
        sequelize.fn(
          "LOWER",
          sequelize.literal(`"labels"[${pgIndex}]`),
        ),
        Op.eq,
        value.toLowerCase(),
      ),
    ),
  };
}

// Build Sequelize WHERE for category listing + search/filters. 
export function buildProductFilterWhere(
  category: ProductCategory,
  filters: ProductSearchFilters,
): WhereOptions {
  const and: WhereOptions[] = [{ category }];

  const query = filters.query?.trim();
  if (query) {
    const term = `%${query}%`;
    and.push({
      [Op.or]: [
        { name: { [Op.iLike]: term } },
        { brand: { [Op.iLike]: term } },
      ],
    });
  }

  if (filters.skinTypes?.length) {
    and.push({
      skinType: { [Op.overlap]: filters.skinTypes },
    });
  }

  if (filters.brands?.length) {
    and.push({
      [Op.or]: filters.brands.map((brand) => ({
        brand: { [Op.iLike]: brand },
      })),
    });
  }

  const allowedIds = new Set(CATEGORY_FILTER_IDS[category]);
  for (const [filterId, values] of Object.entries(
    filters.attributeFilters ?? {},
  )) {
    if (!allowedIds.has(filterId) || values.length === 0) continue;

    const labelIndex = LABEL_FILTER_INDEX[filterId];
    if (labelIndex === undefined) continue;

    and.push(labelAtIndexCondition(labelIndex, values));
  }

  return { [Op.and]: and };
}

// Global product search WHERE (no category constraint).
export function buildProductSearchWhere(
  filters: ProductSearchFilters,
): WhereOptions | null {
  const query = filters.query?.trim();
  if (!query) return null;

  const term = `%${query}%`;
  return {
    [Op.or]: [
      { name: { [Op.iLike]: term } },
      { brand: { [Op.iLike]: term } },
    ],
  };
}
