// Routine DTO for application communication

import { Product, ProductCategory, SkinType } from "./product";

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
  // Routine-level skin type tags (same enum as product `skinType`).
  skinTypeTags: SkinType[];
  author?: RoutineAuthor;
}

// UI label for morning vs night note blocks. 
export type TimeOfDay = "AM" | "PM";

// One row per product in a routine. 
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

export type RoutineProductWithDetails = RoutineProduct & {
  product?: Pick<Product, "id" | "name" | "brand" | "price" | "imageUrls">;
};

export interface RoutineWithProducts extends Routine {
  products?: RoutineProductWithDetails[];
}

export type FeaturedRoutine = {
  routineId: number;
  name: string;
  description?: string;
  userId: string;
  pinnedBy: string; // Diff
  author?: RoutineAuthor;
  skinTypeTags: SkinType[];
  previewImageUrls: string[];
  estimatedTotalPrice: number;
};

// One product's AM/PM note fields for PATCH /routines/id/:id/notes. 
export type RoutineNoteUpdate = {
  productId: number;
  amNote?: string | null;
  pmNote?: string | null;
  amStepOrder?: number | null;
  pmStepOrder?: number | null;
};

export type GuideRoutine = {
  routineId: number;
  name: string;
  description?: string;
  userId: string;
  author?: RoutineAuthor;
  skinTypeTags: SkinType[];
  previewImageUrls: string[];
  estimatedTotalPrice: number;
};
