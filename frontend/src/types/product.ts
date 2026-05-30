// Product DTO for application communication

export interface Product {
  id: number;
  name: string;
  brand: string;

  category: string;
  labels: string[];
  skinType: string[];
  country: string;
  capacity: string;
  price: number;

  instructions: string[];
  activeIngredient?: string;
  ingredients?: string;
  imageUrls: string[];
  averageRating: number;
  reviewCount: number;
  tags?: string[];
}

export type ProductCategory =
  | "cleanser"
  | "toner"
  | "essence"
  | "serum"
  // | "eye cream"
  | "moisturizer"
  | "sunscreen"
  | "other";

export type SkinType =
  | "oily"
  | "dry"
  | "combination"
  | "sensitive"
  | "normal"
  | "acne-prone";

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

/** Client-side filter state — mirrors backend `ProductSearchFilters`. */
export interface ProductListFilters {
  skinTypes: SkinType[];
  brands: string[];
  /** Category-specific keys from `filters.tsx` (texture, benefits, …). */
  attributes: Record<string, string[]>;
  /** Catalog unit price (CAD). 0 = no lower bound. */
  minPrice: number;
  /** Catalog unit price (CAD). At slider max = no upper bound. */
  maxPrice: number;
}

export interface ProductCatalogPage {
  products: Product[];
  total: number;
}

export interface ProductCatalogFetchOptions {
  search?: string;
  filters?: ProductListFilters;
}