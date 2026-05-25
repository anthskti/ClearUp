import { Product } from "@/types/product";
import { ProductMerchantWithDetails } from "@/types/merchant";

// 21600 seconds = 6 hours

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

// Batched merchant-offer reads for routine/product surfaces.
export const MERCHANT_OFFERS_REVALIDATE_SEC = 86400;

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
    { next: { revalidate: MERCHANT_OFFERS_REVALIDATE_SEC } },
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
): Promise<Product[]> => {
  const res = await fetch(
    `${API_URL}/api/products?limit=${limit}&offset=${offset}`,
    {
      next: { revalidate: 21600 },
    },
  );
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
};

export const getProductsByCategory = async (
  category: string,
  limit: number = 25,
  offset: number = 0,
): Promise<Product[]> => {
  const res = await fetch(
    `${API_URL}/api/products/category/${category}?limit=${limit}&offset=${offset}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    console.error(
      `getProductsByCategory failed: ${category} limit=${limit} offset=${offset}`,
    );
    return [];
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const searchProducts = async (
  query: string,
  limit: number = 25,
  offset: number = 0,
): Promise<Product[]> => {
  const res = await fetch(
    `${API_URL}/api/products?search=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) {
    throw new Error(`Failed to search products for "${query}"`);
  }
  return res.json();
};

export const searchProductsByCategory = async (
  category: string,
  query: string,
  limit: number = 25,
  offset: number = 0,
): Promise<Product[]> => {
  const res = await fetch(
    `${API_URL}/api/products/category/${category}?search=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) {
    throw new Error(
      `Failed to search products in category "${category}" for "${query}"`,
    );
  }
  return res.json();
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
    cache: "no-store",
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

export type CsvImportResponse = {
  ok: boolean;
  processed: number;
  created: number;
  updated: number;
  skipped?: number;
  message: string;
  totals?: {
    received: number;
    processed: number;
    created: number;
    updated: number;
    skipped: number;
    failed: number;
  };
  errors?: { row: number; code: string; message: string }[];
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
