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
  concern: 0,
  spf: 0,
  activeIngredient: 0, 
  concentration: 1, // serum
  finish: 1, // moisturizer and sunscreen
  format: 1, // toner and eye-care
  filter: 2,
};

// Allowed filter query keys per category (from filters.tsx specificFilters).
export const CATEGORY_FILTER_IDS: Record<ProductCategory, readonly string[]> = {
  cleanser: ["texture"],
  toner: ["benefits", "format"],
  essence: ["effect"],
  serum: ["activeIngredient", "concentration"],
  eyecare: ["concern", "format"],
  moisturizer: ["texture", "finish"],
  sunscreen: ["spf", "finish", "filter"],
  other: [],
};

export interface ProductSearchFilters {
  query?: string;
  skinTypes?: SkinType[];
  brands?: string[];
  attributeFilters?: Record<string, string[]>;
  minPrice?: number;
  maxPrice?: number;
}

function parsePriceParam(raw: unknown): number | undefined {
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  const n = parseFloat(raw);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return n;
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
    minPrice: parsePriceParam(query.minPrice),
    maxPrice: parsePriceParam(query.maxPrice),
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
    filters.minPrice !== undefined &&
    Number.isFinite(filters.minPrice) &&
    filters.minPrice > 0
  ) {
    return true;
  }
  if (
    filters.maxPrice !== undefined &&
    Number.isFinite(filters.maxPrice) &&
    filters.maxPrice >= 0
  ) {
    return true;
  }
  if (
    filters.attributeFilters &&
    Object.values(filters.attributeFilters).some((v) => v.length > 0)
  ) {
    return true;
  }
  return false;
}

function appendPriceConditions(
  and: WhereOptions[],
  filters: ProductSearchFilters,
): void {
  if (
    filters.minPrice !== undefined &&
    Number.isFinite(filters.minPrice) &&
    filters.minPrice > 0
  ) {
    and.push({ price: { [Op.gte]: filters.minPrice } });
  }
  if (
    filters.maxPrice !== undefined &&
    Number.isFinite(filters.maxPrice) &&
    filters.maxPrice >= 0
  ) {
    and.push({ price: { [Op.lte]: filters.maxPrice } });
  }
}

function appendTextSearchCondition(
  and: WhereOptions[],
  filters: ProductSearchFilters,
): void {
  const query = filters.query?.trim();
  if (!query) return;

  const term = `%${query}%`;
  and.push({
    [Op.or]: [
      { name: { [Op.iLike]: term } },
      { brand: { [Op.iLike]: term } },
    ],
  });
}

function appendSkinTypeCondition(
  and: WhereOptions[],
  filters: ProductSearchFilters,
): void {
  if (!filters.skinTypes?.length) return;
  and.push({ skinType: { [Op.overlap]: filters.skinTypes } });
}

function appendBrandConditions(
  and: WhereOptions[],
  filters: ProductSearchFilters,
): void {
  if (!filters.brands?.length) return;
  and.push({
    [Op.or]: filters.brands.map((brand) => ({
      brand: { [Op.iLike]: brand },
    })),
  });
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

  appendTextSearchCondition(and, filters);
  appendSkinTypeCondition(and, filters);
  appendBrandConditions(and, filters);
  appendPriceConditions(and, filters);

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

// Global catalog WHERE (no category constraint).
export function buildGlobalProductFilterWhere(
  filters: ProductSearchFilters,
): WhereOptions {
  const and: WhereOptions[] = [];

  appendTextSearchCondition(and, filters);
  appendSkinTypeCondition(and, filters);
  appendBrandConditions(and, filters);
  appendPriceConditions(and, filters);

  if (!and.length) {
    return {};
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
