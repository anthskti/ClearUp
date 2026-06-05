import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  BuilderProductNoteEntry,
  RoutineNoteDisplay,
} from "@/types/builder";
import type { Product, ProductCategory } from "@/types/product";
import type { TimeOfDay } from "@/types/routine";

const STORAGE_KEY = "builder-product-notes";

function emptyEntry(
  product: Product,
  category: ProductCategory,
): BuilderProductNoteEntry {
  return {
    productId: product.id,
    productName: product.name,
    productBrand: product.brand,
    category,
    amNote: "",
    pmNote: "",
    amStepOrder: null,
    pmStepOrder: null,
  };
}

function reindexAmSteps(entries: BuilderProductNoteEntry[]): BuilderProductNoteEntry[] {
  const amIds = entries
    .filter((e) => e.amStepOrder !== null)
    .sort((a, b) => (a.amStepOrder ?? 0) - (b.amStepOrder ?? 0))
    .map((e) => e.productId);
  const amOrder = new Map(amIds.map((id, i) => [id, i + 1]));
  return entries.map((e) =>
    e.amStepOrder !== null
      ? { ...e, amStepOrder: amOrder.get(e.productId) ?? e.amStepOrder }
      : e,
  );
}

function reindexPmSteps(entries: BuilderProductNoteEntry[]): BuilderProductNoteEntry[] {
  const pmIds = entries
    .filter((e) => e.pmStepOrder !== null)
    .sort((a, b) => (a.pmStepOrder ?? 0) - (b.pmStepOrder ?? 0))
    .map((e) => e.productId);
  const pmOrder = new Map(pmIds.map((id, i) => [id, i + 1]));
  return entries.map((e) =>
    e.pmStepOrder !== null
      ? { ...e, pmStepOrder: pmOrder.get(e.productId) ?? e.pmStepOrder }
      : e,
  );
}

function reindexAll(entries: BuilderProductNoteEntry[]): BuilderProductNoteEntry[] {
  return reindexPmSteps(reindexAmSteps(entries));
}

function dropEmptyEntries(entries: BuilderProductNoteEntry[]): BuilderProductNoteEntry[] {
  return entries.filter(
    (e) => e.amStepOrder !== null || e.pmStepOrder !== null,
  );
}

function toDisplayRow(
  entry: BuilderProductNoteEntry,
  timeOfDay: TimeOfDay,
): RoutineNoteDisplay {
  const isAm = timeOfDay === "AM";
  return {
    productId: entry.productId,
    timeOfDay,
    stepOrder: (isAm ? entry.amStepOrder : entry.pmStepOrder) ?? 1,
    userNote: isAm ? entry.amNote : entry.pmNote,
    productName: entry.productName,
    productBrand: entry.productBrand,
    category: entry.category,
  };
}

function persistNotes(entries: BuilderProductNoteEntry[]) {
  if (typeof window === "undefined") return;
  const active = dropEmptyEntries(entries);
  if (active.length === 0) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
}

export function useBuilderProductNotes() {
  const [entries, setEntries] = useState<BuilderProductNoteEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setEntries(parsed as BuilderProductNoteEntry[]);
        }
      }
    } catch (e) {
      console.error("Failed to parse product notes", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const id = window.setTimeout(() => persistNotes(entries), 400);
    return () => window.clearTimeout(id);
  }, [entries, isLoaded]);

  const addProductNote = useCallback(
    (
      product: Product,
      category: ProductCategory,
      timeOfDay: TimeOfDay,
      userNote: string,
    ) => {
      setEntries((prev) => {
        const idx = prev.findIndex((e) => e.productId === product.id);
        const isAm = timeOfDay === "AM";
        const amCount = prev.filter((e) => e.amStepOrder !== null).length;
        const pmCount = prev.filter((e) => e.pmStepOrder !== null).length;

        if (idx === -1) {
          const next = emptyEntry(product, category);
          if (isAm) {
            next.amNote = userNote;
            next.amStepOrder = amCount + 1;
          } else {
            next.pmNote = userNote;
            next.pmStepOrder = pmCount + 1;
          }
          return reindexAll([...prev, next]);
        }

        const existing = prev[idx];
        if (isAm && existing.amStepOrder !== null) return prev;
        if (!isAm && existing.pmStepOrder !== null) return prev;

        const updated = [...prev];
        updated[idx] = {
          ...existing,
          productName: product.name,
          productBrand: product.brand,
          category,
          ...(isAm
            ? { amNote: userNote, amStepOrder: amCount + 1 }
            : { pmNote: userNote, pmStepOrder: pmCount + 1 }),
        };
        return reindexAll(updated);
      });
    },
    [],
  );

  const updateProductNote = useCallback(
    (productId: number, timeOfDay: TimeOfDay, userNote: string) => {
      setEntries((prev) =>
        prev.map((e) => {
          if (e.productId !== productId) return e;
          return timeOfDay === "AM"
            ? { ...e, amNote: userNote }
            : { ...e, pmNote: userNote };
        }),
      );
    },
    [],
  );

  const removeProductNote = useCallback(
    (productId: number, timeOfDay: TimeOfDay) => {
      setEntries((prev) => {
        const updated = prev.map((e) => {
          if (e.productId !== productId) return e;
          return timeOfDay === "AM"
            ? { ...e, amNote: "", amStepOrder: null }
            : { ...e, pmNote: "", pmStepOrder: null };
        });
        return reindexAll(dropEmptyEntries(updated));
      });
    },
    [],
  );

  const removeNotesForProduct = useCallback((productId: number) => {
    setEntries((prev) => prev.filter((e) => e.productId !== productId));
  }, []);

  const clearProductNotes = useCallback(() => {
    setEntries([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const morningNotes = useMemo(
    () =>
      entries
        .filter((e) => e.amStepOrder !== null)
        .sort((a, b) => (a.amStepOrder ?? 0) - (b.amStepOrder ?? 0))
        .map((e) => toDisplayRow(e, "AM")),
    [entries],
  );

  const eveningNotes = useMemo(
    () =>
      entries
        .filter((e) => e.pmStepOrder !== null)
        .sort((a, b) => (a.pmStepOrder ?? 0) - (b.pmStepOrder ?? 0))
        .map((e) => toDisplayRow(e, "PM")),
    [entries],
  );

  return {
    entries,
    isLoaded,
    morningNotes,
    eveningNotes,
    addProductNote,
    updateProductNote,
    removeProductNote,
    removeNotesForProduct,
    clearProductNotes,
  };
}
