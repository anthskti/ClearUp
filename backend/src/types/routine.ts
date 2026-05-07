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

export interface RoutineProduct {
  id: number;
  routineId: number;
  productId: number;
  category: ProductCategory;
}

export type CreateRoutineProductInput = Pick<
  RoutineProduct,
  "routineId" | "productId" | "category"
>;
export type UpdateRoutineProductInput = Partial<
  Pick<RoutineProduct, "category">
>;

export type RoutineProductWithDetails = RoutineProduct & {
  product?: Pick<
    Product,
    "id" | "name" | "brand" | "price" | "averageRating" | "imageUrls"
  >;
};

export interface RoutineWithProducts extends Routine {
  products?: RoutineProductWithDetails[];
}
