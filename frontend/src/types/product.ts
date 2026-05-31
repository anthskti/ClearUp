// Product DTO for application communication

import type { ProductListFilters } from "./productListFilters";

export type { ProductListFilters };

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

export interface ProductCatalogPage {
  products: Product[];
  total: number;
}

export interface ProductCatalogFetchOptions {
  search?: string;
  filters?: ProductListFilters;
}