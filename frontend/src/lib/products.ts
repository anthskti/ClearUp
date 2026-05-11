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
      next: { revalidate: 21600 },
    },
  );

  if (!res.ok) {
    throw new Error(
      `Failed to fetch products category ${category}, with limit ${limit} and offset ${offset}`,
    );
    return [];
  }
  return res.json();
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
    next: { revalidate: 21600 },
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
    body: JSON.stringify(merchantData),
  });
  if (!res.ok) {
    throw new Error(`Failed to add merchant to id: ${id}`);
  }
  return res.json();
};

export const importProductsCsv = async (csv: string): Promise<{
  ok: boolean;
  processed: number;
  created: number;
  updated: number;
  message: string;
}> => {
  const res = await fetch(`${API_URL}/api/products/admin/import/csv`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ csv }),
  });
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Failed product CSV import" }));
    throw new Error(errorData.error || "Failed product CSV import");
  }
  return res.json();
};

export const importPriceUpdatesCsv = async (csv: string): Promise<{
  ok: boolean;
  processed: number;
  updatedOffers: number;
  skipped: number;
  message: string;
}> => {
  const res = await fetch(`${API_URL}/api/products/admin/import/prices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ csv }),
  });
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Failed price CSV import" }));
    throw new Error(errorData.error || "Failed price CSV import");
  }
  return res.json();
};
