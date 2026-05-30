import {
  CATEGORY_CONFIG,
  CategoryKey,
} from "@/constants/filters";
import {
  parseSkinTypeTagsFromParam,
  skinTypeLabel,
} from "@/lib/routineSkinTypeTags";
import type { SkinType, ProductListFilters } from "@/types/product";

export const EMPTY_PRODUCT_LIST_FILTERS: ProductListFilters = {
  skinTypes: [],
  brands: [],
  attributes: {},
};

function parseCsvParam(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return [
    ...new Set(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ];
}

export function parseGlobalProductListFiltersFromSearchParams(
  params: Record<string, string | undefined>,
): ProductListFilters {
  return {
    skinTypes: parseSkinTypeTagsFromParam(params.skinType),
    brands: parseCsvParam(params.brands),
    attributes: {},
  };
}

export function flattenSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string | undefined> {
  const flat: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(sp)) {
    if (value === undefined) continue;
    flat[key] = Array.isArray(value) ? value[0] : value;
  }
  return flat;
}

export function parseProductListFiltersFromSearchParams(
  params: Record<string, string | undefined>,
  category: string,
): ProductListFilters {
  const config =
    CATEGORY_CONFIG[category as CategoryKey] ?? CATEGORY_CONFIG.default;

  const attributes: Record<string, string[]> = {};
  for (const filter of config.specificFilters) {
    const values = parseCsvParam(params[filter.id]);
    if (values.length > 0) {
      attributes[filter.id] = values;
    }
  }

  return {
    skinTypes: parseSkinTypeTagsFromParam(params.skinType),
    brands: parseCsvParam(params.brands),
    attributes,
  };
}

export function hasActiveProductListFilters(
  filters: ProductListFilters,
  search?: string,
): boolean {
  if (search?.trim()) return true;
  if (filters.skinTypes.length > 0) return true;
  if (filters.brands.length > 0) return true;
  return Object.values(filters.attributes).some((values) => values.length > 0);
}

export function productListFiltersToSearchParams(
  filters: ProductListFilters,
  search?: string,
): URLSearchParams {
  const qs = new URLSearchParams();
  if (search?.trim()) qs.set("search", search.trim());
  if (filters.skinTypes.length > 0) {
    qs.set("skinType", filters.skinTypes.join(","));
  }
  if (filters.brands.length > 0) {
    qs.set("brands", filters.brands.join(","));
  }
  for (const [id, values] of Object.entries(filters.attributes)) {
    if (values.length > 0) qs.set(id, values.join(","));
  }
  return qs;
}

/** Append filter state to an existing query string builder (API fetch). */
export function appendProductListFiltersToQuery(
  qs: URLSearchParams,
  filters?: ProductListFilters,
): void {
  if (!filters) return;
  if (filters.skinTypes.length > 0) {
    qs.set("skinType", filters.skinTypes.join(","));
  }
  if (filters.brands.length > 0) {
    qs.set("brands", filters.brands.join(","));
  }
  for (const [id, values] of Object.entries(filters.attributes)) {
    if (values.length > 0) qs.set(id, values.join(","));
  }
}

function toggleInList<T extends string>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export function toggleSkinTypeFilter(
  filters: ProductListFilters,
  skinType: SkinType,
): ProductListFilters {
  return {
    ...filters,
    skinTypes: toggleInList(filters.skinTypes, skinType),
  };
}

export function toggleBrandFilter(
  filters: ProductListFilters,
  brand: string,
): ProductListFilters {
  return {
    ...filters,
    brands: toggleInList(filters.brands, brand),
  };
}

export function toggleAttributeFilter(
  filters: ProductListFilters,
  attributeId: string,
  value: string,
): ProductListFilters {
  const current = filters.attributes[attributeId] ?? [];
  const next = toggleInList(current, value);
  const attributes = { ...filters.attributes };
  if (next.length === 0) {
    delete attributes[attributeId];
  } else {
    attributes[attributeId] = next;
  }
  return { ...filters, attributes };
}

export { skinTypeLabel };

