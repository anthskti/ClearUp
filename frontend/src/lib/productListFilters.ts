import {
  CATEGORY_CONFIG,
  CategoryKey,
} from "@/constants/filters";
import { PRODUCT_PRICE_SLIDER_MAX } from "@/constants/productFilters";
import {
  parseMinSliderValue,
  parseMaxSliderValue,
} from "@/lib/priceRange";
import {
  parseSkinTypeTagsFromParam,
  skinTypeLabel,
} from "@/lib/routineSkinTypeTags";
import type { SkinType, ProductListFilters } from "@/types/product";

export const EMPTY_PRODUCT_LIST_FILTERS: ProductListFilters = {
  skinTypes: [],
  brands: [],
  attributes: {},
  minPrice: 0,
  maxPrice: PRODUCT_PRICE_SLIDER_MAX,
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

function parsePriceFiltersFromParams(
  params: Record<string, string | undefined>,
): Pick<ProductListFilters, "minPrice" | "maxPrice"> {
  const minPrice = parseMinSliderValue(
    params.minPrice ?? "",
    PRODUCT_PRICE_SLIDER_MAX,
  );
  const maxPrice = parseMaxSliderValue(
    params.maxPrice ?? "",
    PRODUCT_PRICE_SLIDER_MAX,
  );
  return {
    minPrice,
    maxPrice: Math.max(maxPrice, minPrice),
  };
}

export function parseGlobalProductListFiltersFromSearchParams(
  params: Record<string, string | undefined>,
): ProductListFilters {
  return {
    skinTypes: parseSkinTypeTagsFromParam(params.skinType),
    brands: parseCsvParam(params.brands),
    attributes: {},
    ...parsePriceFiltersFromParams(params),
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
    ...parsePriceFiltersFromParams(params),
  };
}

export function hasActiveProductListFilters(
  filters: ProductListFilters,
  search?: string,
): boolean {
  if (search?.trim()) return true;
  if (filters.skinTypes.length > 0) return true;
  if (filters.brands.length > 0) return true;
  if (filters.minPrice > 0) return true;
  if (filters.maxPrice < PRODUCT_PRICE_SLIDER_MAX) return true;
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
  if (filters.minPrice > 0) {
    qs.set("minPrice", String(filters.minPrice));
  }
  if (filters.maxPrice < PRODUCT_PRICE_SLIDER_MAX) {
    qs.set("maxPrice", String(filters.maxPrice));
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
  if (filters.minPrice > 0) {
    qs.set("minPrice", String(filters.minPrice));
  }
  if (filters.maxPrice < PRODUCT_PRICE_SLIDER_MAX) {
    qs.set("maxPrice", String(filters.maxPrice));
  }
  for (const [id, values] of Object.entries(filters.attributes)) {
    if (values.length > 0) qs.set(id, values.join(","));
  }
}

export function productListFiltersNeedDynamicFetch(
  filters?: ProductListFilters,
  search?: string,
): boolean {
  if (search?.trim()) return true;
  if (!filters) return false;
  if (filters.skinTypes.length > 0) return true;
  if (filters.brands.length > 0) return true;
  if (filters.minPrice > 0) return true;
  if (filters.maxPrice < PRODUCT_PRICE_SLIDER_MAX) return true;
  return Object.values(filters.attributes).some((values) => values.length > 0);
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

export function setProductPriceRange(
  filters: ProductListFilters,
  range: [number, number],
): ProductListFilters {
  return {
    ...filters,
    minPrice: range[0],
    maxPrice: range[1],
  };
}

export { skinTypeLabel };
