import type {
  BuilderProductNoteEntry,
  RoutineNoteDisplay,
  RoutineProductInput,
} from "@/types/builder";
import type { ProductCategory } from "@/types/product";
import type { RoutineProductWithDetails, TimeOfDay } from "@/types/routine";
import { effectiveRoutineProductCategory } from "@/lib/routineProductCategory";

type GridSlot = {
  id: ProductCategory;
  products: Array<{ id: number }>;
};

function categoryByProductFromGrid(
  routine: GridSlot[],
): Map<number, ProductCategory> {
  const map = new Map<number, ProductCategory>();
  for (const slot of routine) {
    for (const product of slot.products) {
      map.set(product.id, slot.id);
    }
  }
  return map;
}

// One API row per grid product; optional AM/PM notes on the same row.
export function buildRoutineSaveItems(
  routine: GridSlot[],
  noteEntries: BuilderProductNoteEntry[],
): RoutineProductInput[] {
  const notesByProduct = new Map(
    noteEntries.map((entry) => [entry.productId, entry]),
  );
  const gridCategory = categoryByProductFromGrid(routine);
  const items: RoutineProductInput[] = [];
  const seen = new Set<number>();

  for (const slot of routine) {
    for (const product of slot.products) {
      if (seen.has(product.id)) continue;
      seen.add(product.id);
      const entry = notesByProduct.get(product.id);
      const amText = entry?.amNote.trim() || null;
      const pmText = entry?.pmNote.trim() || null;
      items.push({
        productId: product.id,
        category: gridCategory.get(product.id) ?? slot.id,
        amNote: amText,
        pmNote: pmText,
        amStepOrder: entry?.amStepOrder ?? null,
        pmStepOrder: entry?.pmStepOrder ?? null,
      });
    }
  }

  return items;
}

// Client-side guard before POST /bulk — avoids empty create hitting the server.
export function assertRoutineSaveItemsValid(
  items: RoutineProductInput[],
): void {
  if (!items.length) {
    throw new Error("Add at least one product before saving your routine.");
  }
}

function pushNoteFromRow(
  rows: RoutineNoteDisplay[],
  rp: RoutineProductWithDetails,
  timeOfDay: TimeOfDay,
  userNote: string,
  stepOrder: number,
): void {
  if (!rp.product) return;
  rows.push({
    productId: rp.productId,
    timeOfDay,
    stepOrder,
    userNote,
    productName: rp.product.name,
    productBrand: rp.product.brand,
    category: effectiveRoutineProductCategory(rp),
  });
}

// Expand flat junction rows into AM/PM note display entries.
export function hydrateRoutineProductNotesFromApi(
  products: RoutineProductWithDetails[],
): RoutineNoteDisplay[] {
  const rows: RoutineNoteDisplay[] = [];
  for (const rp of products) {
    if (rp.amStepOrder != null) {
      pushNoteFromRow(
        rows,
        rp,
        "AM",
        rp.amNote?.trim() ?? "",
        rp.amStepOrder,
      );
    }
    if (rp.pmStepOrder != null) {
      pushNoteFromRow(
        rows,
        rp,
        "PM",
        rp.pmNote?.trim() ?? "",
        rp.pmStepOrder,
      );
    }
  }
  return rows.sort((a, b) => {
    if (a.timeOfDay !== b.timeOfDay) return a.timeOfDay === "AM" ? -1 : 1;
    return a.stepOrder - b.stepOrder;
  });
}

export function hydrateProductNotesFromApi(
  products: RoutineProductWithDetails[],
): RoutineNoteDisplay[] {
  return hydrateRoutineProductNotesFromApi(products);
}
