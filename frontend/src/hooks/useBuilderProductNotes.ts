import { useCallback, useEffect, useMemo, useState } from "react";
import type { RoutineNoteDisplay } from "@/types/builder";
import type { Product, ProductCategory } from "@/types/product";
import type { TimeOfDay } from "@/types/routine";
import { useDebouncedLocalStorage } from "./useDebouncedLocalStorage";

const STORAGE_KEY = "builder-product-notes";

// Consistent bug with duplications fix
function dedupeNotes(notes: RoutineNoteDisplay[]): RoutineNoteDisplay[] {
  const seen = new Set<string>();
  return notes.filter((n) => {
    const key = `${n.productId}-${n.timeOfDay}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function reindexBlock(
  notes: RoutineNoteDisplay[],
  timeOfDay: TimeOfDay,
): RoutineNoteDisplay[] {
  const block = notes
    .filter((n) => n.timeOfDay === timeOfDay)
    .sort((a, b) => a.stepOrder - b.stepOrder);
  const orderMap = new Map(
    block.map((n, i) => [`${n.productId}-${timeOfDay}`, i + 1]),
  );
  return notes.map((n) =>
    n.timeOfDay === timeOfDay
      ? { ...n, stepOrder: orderMap.get(`${n.productId}-${timeOfDay}`) ?? n.stepOrder }
      : n,
  );
}

export function useBuilderProductNotes() {
  const [notes, setNotes] = useState<RoutineNoteDisplay[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as RoutineNoteDisplay[];
        setNotes(
          reindexBlock(reindexBlock(dedupeNotes(parsed), "AM"), "PM"),
        );
      }
    } catch (e) {
      console.error("Failed to parse product notes", e);
    }
    setIsLoaded(true);
  }, []);

  useDebouncedLocalStorage(STORAGE_KEY, notes, isLoaded);

  const addProductNote = useCallback(
    (
      product: Product,
      category: ProductCategory,
      timeOfDay: TimeOfDay,
      userNote: string,
    ) => {
      setNotes((prev) => {
        if (
          prev.some(
            (n) => n.productId === product.id && n.timeOfDay === timeOfDay,
          )
        ) {
          return prev;
        }
        const blockSize = prev.filter((n) => n.timeOfDay === timeOfDay).length;
        const next: RoutineNoteDisplay = {
          productId: product.id,
          timeOfDay,
          stepOrder: blockSize + 1,
          userNote,
          productName: product.name,
          productBrand: product.brand,
          category,
        };
        return reindexBlock([...prev, next], timeOfDay);
      });
    },
    [],
  );

  const updateProductNote = useCallback(
    (productId: number, timeOfDay: TimeOfDay, userNote: string) => {
      setNotes((prev) =>
        prev.map((n) =>
          n.productId === productId && n.timeOfDay === timeOfDay
            ? { ...n, userNote }
            : n,
        ),
      );
    },
    [],
  );

  const removeProductNote = useCallback(
    (productId: number, timeOfDay: TimeOfDay) => {
      setNotes((prev) =>
        reindexBlock(
          prev.filter(
            (n) => !(n.productId === productId && n.timeOfDay === timeOfDay),
          ),
          timeOfDay,
        ),
      );
    },
    [],
  );

  /** Drop notes for a product removed from the routine grid. */
  const removeNotesForProduct = useCallback((productId: number) => {
    setNotes((prev) => {
      const filtered = prev.filter((n) => n.productId !== productId);
      if (filtered.length === prev.length) return prev;
      return reindexBlock(reindexBlock(filtered, "AM"), "PM");
    });
  }, []);

  /** Keep only notes for products still in the routine (cleans stale localStorage). */
  const pruneNotesToProductIds = useCallback((productIds: number[]) => {
    const allowed = new Set(productIds);
    setNotes((prev) => {
      const filtered = prev.filter((n) => allowed.has(n.productId));
      if (filtered.length === prev.length) return prev;
      return reindexBlock(reindexBlock(filtered, "AM"), "PM");
    });
  }, []);

  const clearProductNotes = useCallback(() => {
    setNotes([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const loadProductNotes = useCallback((next: RoutineNoteDisplay[]) => {
    setNotes(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const morningNotes = useMemo(
    () =>
      notes
        .filter((n) => n.timeOfDay === "AM")
        .sort((a, b) => a.stepOrder - b.stepOrder),
    [notes],
  );

  const eveningNotes = useMemo(
    () =>
      notes
        .filter((n) => n.timeOfDay === "PM")
        .sort((a, b) => a.stepOrder - b.stepOrder),
    [notes],
  );

  const hasNoteFor = useCallback(
    (productId: number, timeOfDay: TimeOfDay) =>
      notes.some((n) => n.productId === productId && n.timeOfDay === timeOfDay),
    [notes],
  );

  return {
    notes,
    isLoaded,
    morningNotes,
    eveningNotes,
    addProductNote,
    updateProductNote,
    removeProductNote,
    removeNotesForProduct,
    pruneNotesToProductIds,
    clearProductNotes,
    loadProductNotes,
    hasNoteFor,
  };
}
