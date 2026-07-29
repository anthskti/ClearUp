import type { ProductCategory } from "@/types/product";
import type { RoutineProductWithDetails } from "@/types/routine";

// Live catalog category when joined; fall back to denormalized join snapshot.
export function effectiveRoutineProductCategory(
  rp: Pick<RoutineProductWithDetails, "category" | "product">,
): ProductCategory {
  const live = rp.product?.category;
  return (live as ProductCategory | undefined) ?? rp.category;
}
