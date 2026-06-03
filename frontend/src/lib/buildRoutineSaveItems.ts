import type { RoutineNoteDisplay, RoutineProductInput } from "@/types/builder";
import type { ProductCategory } from "@/types/product";
import type { RoutineProductWithDetails } from "@/types/routine";

type GridSlot = {
  id: ProductCategory;
  products: Array<{ id: number }>;
};

/**
 * Merge PCPartPicker grid + product-linked notes into API junction rows.
 * Same product can appear twice (AM + PM) when it has notes for both.
 * Grid-only products get a single AM row with null userNote.
 */
export function buildRoutineSaveItems(
  routine: GridSlot[],
  notes: RoutineNoteDisplay[],
): RoutineProductInput[] {
  const categoryByProductId = new Map<number, ProductCategory>();
  for (const slot of routine) {
    for (const product of slot.products) {
      categoryByProductId.set(product.id, slot.id);
    }
  }

  const items: RoutineProductInput[] = [];
  const amNotes = notes
    .filter((n) => n.timeOfDay === "AM")
    .sort((a, b) => a.stepOrder - b.stepOrder);
  const pmNotes = notes
    .filter((n) => n.timeOfDay === "PM")
    .sort((a, b) => a.stepOrder - b.stepOrder);

  let amStep = 0;
  for (const note of amNotes) {
    const category = categoryByProductId.get(note.productId);
    if (!category) continue;
    items.push({
      productId: note.productId,
      category,
      timeOfDay: "AM",
      stepOrder: ++amStep,
      userNote: note.userNote.trim() || null,
    });
  }

  let pmStep = 0;
  for (const note of pmNotes) {
    const category = categoryByProductId.get(note.productId);
    if (!category) continue;
    items.push({
      productId: note.productId,
      category,
      timeOfDay: "PM",
      stepOrder: ++pmStep,
      userNote: note.userNote.trim() || null,
    });
  }

  for (const [productId, category] of categoryByProductId) {
    const hasAm = items.some(
      (i) => i.productId === productId && i.timeOfDay === "AM",
    );
    if (!hasAm) {
      items.push({
        productId,
        category,
        timeOfDay: "AM",
        stepOrder: ++amStep,
        userNote: null,
      });
    }
  }

  return items;
}

// Map saved routine_products → note display rows (junction category = grid slot). 
export function hydrateProductNotesFromApi(
  products: RoutineProductWithDetails[],
): RoutineNoteDisplay[] {
  return products
    .filter((rp) => rp.userNote?.trim() && rp.product)
    .sort((a, b) => {
      if (a.timeOfDay !== b.timeOfDay) return a.timeOfDay === "AM" ? -1 : 1;
      return a.stepOrder - b.stepOrder;
    })
    .map((rp) => ({
      productId: rp.productId,
      timeOfDay: rp.timeOfDay,
      stepOrder: rp.stepOrder,
      userNote: rp.userNote ?? "",
      productName: rp.product!.name,
      productBrand: rp.product!.brand,
      category: rp.category,
    }));
}
