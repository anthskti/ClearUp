import type { ProductCategory } from "./product";
import type { TimeOfDay } from "./routine";

// consistently display shape for a product usage note (builder + public routine view). 
export type RoutineNoteDisplay = {
  productId: number;
  timeOfDay: TimeOfDay;
  stepOrder: number;
  userNote: string;
  productName: string;
  productBrand: string;
  category: ProductCategory;
};

export type RoutineProductInput = {
  productId: number;
  category: ProductCategory;
  timeOfDay?: TimeOfDay;
  stepOrder?: number;
  userNote?: string | null;
};
