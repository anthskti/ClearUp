import type { SkinType } from "./product";

// Client-side catalog filter state — mirrors backend `ProductSearchFilters`. 
export interface ProductListFilters {
  skinTypes: SkinType[];
  brands: string[];
  // Category-specific keys from `filters.tsx` (texture, benefits, …). 
  attributes: Record<string, string[]>;
  minPrice: number;
  maxPrice: number;
}

// Inclusive min/max price range for the catalog price slider (CAD). 
export type ProductPriceRange = [min: number, max: number];
