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

export interface RoutineProduct {
  id: number;
  routineId: number;
  productId: number;
  category: ProductCategory;
}

export type RoutineProductWithDetails = RoutineProduct & {
  product?: Pick<
    Product,
    "id" | "name" | "brand" | "price" | "averageRating" | "imageUrls"
  >;
};

export interface RoutineWithProducts extends Routine {
  products?: RoutineProductWithDetails[];
}
