import type { ProductCategory } from "./product";
import type { TimeOfDay } from "./routine";

// Builder draft: one entry per product, flat AM/PM fields (matches API).
export type BuilderProductNoteEntry = {
  productId: number;
  productName: string;
  productBrand: string;
  category: ProductCategory;
  amNote: string;
  pmNote: string;
  amStepOrder: number | null;
  pmStepOrder: number | null;
};

// UI list item for one AM or PM column (derived from BuilderProductNoteEntry). 
export type RoutineNoteDisplay = {
  productId: number;
  timeOfDay: TimeOfDay;
  stepOrder: number;
  userNote: string;
  productName: string;
  productBrand: string;
  category: ProductCategory;
};

// API payload for one product in a routine (bulk save / upsert). 
export type RoutineProductInput = {
  productId: number;
  category: ProductCategory;
  amNote?: string | null;
  pmNote?: string | null;
  amStepOrder?: number | null;
  pmStepOrder?: number | null;
};
