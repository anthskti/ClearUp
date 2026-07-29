import type { Product, ProductListFilters, ProductCatalogFetchOptions, ProductCatalogPage, CsvImportResponse } from "@/types/product";
import { ProductMerchantWithDetails } from "@/types/merchant";
import { appendProductListFiltersToQuery, productListFiltersNeedDynamicFetch } from "@/lib/productListFilters";
import { PRODUCT_PRICE_SLIDER_MAX } from "@/constants/productFilters";
import { parseSkinTypeTagsFromParam } from "@/lib/routineSkinTypeTags";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

function parseProductCatalogResponse(data: unknown): ProductCatalogPage {
  if (Array.isArray(data)) {
    return { products: data, total: data.length };
  }
  if (data && typeof data === "object" && "products" in data) {
    const payload = data as { products?: unknown; total?: unknown };
    const products = Array.isArray(payload.products) ? payload.products : [];
    const total =
      typeof payload.total === "number" && Number.isFinite(payload.total)
        ? payload.total
        : products.length;
    return { products, total };
  }
  return { products: [], total: 0 };
}

// Category lists (server Data Cache). PDP product body uses no-store.
export const CATALOG_REVALIDATE_SEC = 3600; // 1h

/** Per-product merchant offers on PDP (server Data Cache). */
export const PRODUCT_MERCHANTS_REVALIDATE_SEC = 1800; // 30m

/** Batched offers on routine pages (server Data Cache). */
export const BATCH_MERCHANT_OFFERS_REVALIDATE_SEC = 21600; // 6h

/** @deprecated Use BATCH_MERCHANT_OFFERS_REVALIDATE_SEC */
export const MERCHANT_OFFERS_REVALIDATE_SEC =
  BATCH_MERCHANT_OFFERS_REVALIDATE_SEC;

// Same rule as builder: lowest product_merchant.price gets shown.
export function pickLowestPriceOffer(
  offers: ProductMerchantWithDetails[],
): ProductMerchantWithDetails | null {
  if (!offers?.length) return null;
  return [...offers].sort((a, b) => a.price - b.price)[0];
}

// Lazy recompute on read: one request returns current offers per product id.
// Cached at the HTTP/Data Cache layer (not a DB cron).
export async function getMerchantOffersByProductIds(
  productIds: number[],
): Promise<Record<number, ProductMerchantWithDetails[]>> {
  const unique = [
    ...new Set(productIds.filter((id) => Number.isFinite(id) && id > 0)),
  ];
  if (!unique.length) return {};

  const qs = unique.sort((a, b) => a - b).join(",");
  const res = await fetch(
    `${API_URL}/api/products/merchants/batch?ids=${encodeURIComponent(qs)}`,
    { next: { revalidate: BATCH_MERCHANT_OFFERS_REVALIDATE_SEC } },
  );
  if (!res.ok) {
    console.error("getMerchantOffersByProductIds: batch request failed");
    return Object.fromEntries(unique.map((id) => [id, []]));
  }

  const json = (await res.json()) as Record<
    string,
    ProductMerchantWithDetails[]
  >;
  const out: Record<number, ProductMerchantWithDetails[]> = {};
  for (const id of unique) {
    out[id] = json[String(id)] ?? [];
  }
  return out;
}

export const getAllProducts = async (
  limit: number = 25,
  offset: number = 0,
  options?: ProductCatalogFetchOptions,
): Promise<Product[]> => {
  const page = await fetchProducts(limit, offset, options);
  return page.products;
};

// Unified full-catalog fetch — search + skin type / brand filters. 
export async function fetchProducts(
  limit: number = 25,
  offset: number = 0,
  options?: ProductCatalogFetchOptions,
): Promise<ProductCatalogPage> {
  const qs = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (options?.search?.trim()) {
    qs.set("search", options.search.trim());
  }
  appendProductListFiltersToQuery(qs, options?.filters);

  const hasFilters = productListFiltersNeedDynamicFetch(
    options?.filters,
    options?.search,
  );

  const res = await fetch(`${API_URL}/api/products?${qs.toString()}`, {
    ...(hasFilters
      ? { cache: "no-store" as const }
      : { next: { revalidate: CATALOG_REVALIDATE_SEC } }),
  });

  if (!res.ok) {
    console.error(
      `fetchProducts failed: limit=${limit} offset=${offset}`,
    );
    return { products: [], total: 0 };
  }
  const data = await res.json();
  return parseProductCatalogResponse(data);
}

export async function fetchAllBrands(): Promise<string[]> {
  const res = await fetch(`${API_URL}/api/products/brands`, {
    next: { revalidate: CATALOG_REVALIDATE_SEC },
  });
  if (!res.ok) {
    console.error("fetchAllBrands failed");
    return [];
  }
  const data = await res.json();
  return Array.isArray(data) ? data.filter(Boolean) : [];
}

export const getProductsByCategory = async (
  category: string,
  limit: number = 25,
  offset: number = 0,
  options?: { skinType?: string; search?: string },
): Promise<Product[]> => {
  const skinTypes = parseSkinTypeTagsFromParam(options?.skinType);
  const filters: ProductListFilters | undefined =
    skinTypes.length > 0
      ? {
          skinTypes,
          brands: [],
          attributes: {},
          minPrice: 0,
          maxPrice: PRODUCT_PRICE_SLIDER_MAX,
        }
      : undefined;

  const page = await fetchProductsByCategory(category, limit, offset, {
    search: options?.search,
    filters,
  });
  return page.products;
};

// Unified category catalog fetch — search + sidebar filters. 
export async function fetchProductsByCategory(
  category: string,
  limit: number = 25,
  offset: number = 0,
  options?: ProductCatalogFetchOptions,
): Promise<ProductCatalogPage> {
  const qs = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (options?.search?.trim()) {
    qs.set("search", options.search.trim());
  }
  appendProductListFiltersToQuery(qs, options?.filters);

  const hasFilters = productListFiltersNeedDynamicFetch(
    options?.filters,
    options?.search,
  );

  const res = await fetch(
    `${API_URL}/api/products/category/${category}?${qs.toString()}`,
    hasFilters ? { cache: "no-store" } : { next: { revalidate: CATALOG_REVALIDATE_SEC } },
  );

  if (!res.ok) {
    console.error(
      `fetchProductsByCategory failed: ${category} limit=${limit} offset=${offset}`,
    );
    return { products: [], total: 0 };
  }
  const data = await res.json();
  return parseProductCatalogResponse(data);
}

export async function fetchCategoryBrands(category: string): Promise<string[]> {
  const res = await fetch(
    `${API_URL}/api/products/category/${category}/brands`,
    { next: { revalidate: CATALOG_REVALIDATE_SEC } },
  );
  if (!res.ok) {
    console.error(`fetchCategoryBrands failed: ${category}`);
    return [];
  }
  const data = await res.json();
  return Array.isArray(data) ? data.filter(Boolean) : [];
}

export const searchProducts = async (
  query: string,
  limit: number = 25,
  offset: number = 0,
  filters?: ProductListFilters,
): Promise<Product[]> => {
  const page = await fetchProducts(limit, offset, { search: query, filters });
  return page.products;
};

export const searchProductsByCategory = async (
  category: string,
  query: string,
  limit: number = 25,
  offset: number = 0,
  filters?: ProductListFilters,
): Promise<Product[]> => {
  const page = await fetchProductsByCategory(category, limit, offset, {
    search: query,
    filters,
  });
  return page.products;
};

export const getProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`${API_URL}/api/products/id/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch product ${id}`);
  }
  return res.json();
};

export const getMerchantsByProductId = async (
  productId: string,
): Promise<ProductMerchantWithDetails[]> => {
  const res = await fetch(`${API_URL}/api/products/id/${productId}/merchants`, {
    next: { revalidate: PRODUCT_MERCHANTS_REVALIDATE_SEC },
  });
  if (!res.ok) {
    console.error(`Failed to fetch merchants for product: ${productId}`);
    return [];
  }
  return res.json();
};

export const addMerchantByProductId = async (
  id: number,
  merchantData: {
    merchantId: number;
    website: string;
    price: number;
    stock: boolean;
    shipping: string;
  },
): Promise<Product> => {
  const res = await fetch(`${API_URL}/api/products/id/${id}/merchants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(merchantData),
  });
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: `Failed to add merchant to product ${id}` }));
    throw new Error(
      errorData.error || `Failed to add merchant to product ${id}`,
    );
  }
  return res.json();
};

async function readImportError(res: Response): Promise<string> {
  const fallback = `Import failed (HTTP ${res.status})`;
  try {
    const data = (await res.json()) as { error?: string; message?: string };
    if (res.status === 413) {
      return (
        data.error ||
        "CSV file is too large for the server limit. Try a smaller batch."
      );
    }
    return data.error || data.message || fallback;
  } catch {
    if (res.status === 413) {
      return "CSV payload too large (HTTP 413). Try importing in smaller batches.";
    }
    return fallback;
  }
}

async function postCsvImport(
  path: string,
  csvOrFile: string | File,
): Promise<Response> {
  const init: RequestInit = {
    method: "POST",
    credentials: "include",
    body: csvOrFile,
  };
  if (typeof csvOrFile === "string") {
    init.headers = { "Content-Type": "text/csv; charset=utf-8" };
  }
  return fetch(`${API_URL}${path}`, init);
}

/** Import via raw CSV body (paste or File) — avoids JSON size overhead/limit. */
export const importProductsCsv = async (
  csvOrFile: string | File,
): Promise<CsvImportResponse> => {
  const res = await postCsvImport("/api/products/admin/import/csv", csvOrFile);
  if (!res.ok) {
    throw new Error(await readImportError(res));
  }
  return res.json();
};

export const importPriceUpdatesCsv = async (
  csvOrFile: string | File,
): Promise<{
  ok: boolean;
  processed: number;
  updatedOffers: number;
  skipped: number;
  message: string;
}> => {
  const res = await postCsvImport(
    "/api/products/admin/import/prices",
    csvOrFile,
  );
  if (!res.ok) {
    throw new Error(await readImportError(res));
  }
  return res.json();
};
