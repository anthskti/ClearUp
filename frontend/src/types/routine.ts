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
