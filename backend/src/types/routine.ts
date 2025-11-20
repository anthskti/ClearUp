// Routine DTO for application communication

import { ProductCategory } from "./product";

export interface Routine {
  id: number;
  name: string;
  description?: string;
  userId: number;
}

export interface RoutineProduct {
  id: number;
  routineId: number;
  productId: number;
  category: ProductCategory;
  timeOfDay?: "morning" | "evening" | "both";
  notes?: string;
}

export interface RoutineWithProducts extends Routine {
  products?: RoutineProduct[];
}

