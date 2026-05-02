// Routine DTO for application communication

import { Product, ProductCategory } from "./product";

export interface Routine {
  id: number;
  name: string;
  description?: string;
  userId: string;
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
