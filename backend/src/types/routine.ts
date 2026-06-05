// Routine DTO for application communication

import { Product, ProductCategory, SkinType } from "./product";

// Public author summary for routine cards and guide headers (from `User` join). 
export interface RoutineAuthor {
  id: string;
  name: string;
  email: string;
}

export interface Routine {
  id: number;
  name: string;
  description?: string;
  userId: string;
  // Routine-level audience tags (subset of product SkinType enum).
  skinTypeTags: SkinType[];
  // Present when the API loads the owning user (list/detail with join). 
  author?: RoutineAuthor;
}

/** One junction row per product in a routine. */
export interface RoutineProduct {
  id: number;
  routineId: number;
  productId: number;
  category: ProductCategory;
  amNote: string | null;
  pmNote: string | null;
  amStepOrder: number | null;
  pmStepOrder: number | null;
}

export type CreateRoutineProductInput = {
  routineId: number;
  productId: number;
  category: ProductCategory;
  amNote: string | null;
  pmNote: string | null;
  amStepOrder: number | null;
  pmStepOrder: number | null;
};

export type AddRoutineProductInput = {
  productId: number;
  category: ProductCategory;
  amNote?: string | null;
  pmNote?: string | null;
  amStepOrder?: number | null;
  pmStepOrder?: number | null;
};

export type UpsertRoutineProductItem = AddRoutineProductInput;

export type CreateRoutineWithProductsInput = {
  name: string;
  description?: string;
  userId: string;
  skinTypeTags?: unknown;
  items: AddRoutineProductInput[];
};

export type UpdateRoutineProductInput = Partial<
  Pick<
    RoutineProduct,
    "category" | "amNote" | "pmNote" | "amStepOrder" | "pmStepOrder"
  >
>;

export type RoutineProductWithDetails = RoutineProduct & {
  product?: Pick<Product, "id" | "name" | "brand" | "price" | "imageUrls">;
};

export interface RoutineWithProducts extends Routine {
  products?: RoutineProductWithDetails[];
}

// Public guides listing (registered authors only, server-filtered). 
export type GuideRoutineView = {
  routineId: number;
  name: string;
  description?: string;
  userId: string;
  author?: RoutineAuthor;
  skinTypeTags: SkinType[];
  previewImageUrls: string[];
  /** Sum of linked product prices (CAD in catalog). */
  estimatedTotalPrice: number;
};
