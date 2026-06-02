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

export type TimeOfDay = "AM" | "PM";

export interface RoutineProduct {
  id: number;
  routineId: number;
  productId: number;
  category: ProductCategory;
  timeOfDay: TimeOfDay;
  stepOrder: number;
  userNote: string | null;
}

// Persisted row shape (all fields set after normalization).
export type CreateRoutineProductInput = {
  routineId: number;
  productId: number;
  category: ProductCategory;
  timeOfDay: TimeOfDay;
  stepOrder: number;
  userNote: string | null;
};

// POST /api/routines/id/:id/products — timeOfDay, stepOrder, userNote optional.
export type AddRoutineProductInput = {
  productId: number;
  category: ProductCategory;
  timeOfDay?: TimeOfDay;
  stepOrder?: number;
  userNote?: string | null;
};

// Same shape as AddRoutineProductInput (no routineId yet). 
export type UpsertRoutineProductItem = AddRoutineProductInput;

// POST /api/routines/bulk — routine metadata + product lineup. 
export type CreateRoutineWithProductsInput = {
  name: string;
  description?: string;
  userId: string;
  skinTypeTags?: unknown;
  // Becomes `routine_products` rows after create.
  items: AddRoutineProductInput[];
};
export type UpdateRoutineProductInput = Partial<
  Pick<RoutineProduct, "category" | "timeOfDay" | "stepOrder" | "userNote">
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

