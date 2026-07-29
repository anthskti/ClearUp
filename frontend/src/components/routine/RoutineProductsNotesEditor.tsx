"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hydrateRoutineProductNotesFromApi } from "@/lib/buildRoutineSaveItems";
import { effectiveRoutineProductCategory } from "@/lib/routineProductCategory";
import { saveRoutineNotes } from "@/lib/routines";
import type { RoutineNoteDisplay } from "@/types/builder";
import type { ProductCategory } from "@/types/product";
import type {
  RoutineNoteUpdate,
  RoutineProductWithDetails,
  TimeOfDay,
} from "@/types/routine";
import BuilderProductNotesSection from "./BuilderProductNotesSection";

interface RoutineUsageNotesEditorProps {
  routineId: number;
  canEdit: boolean;
  initialProducts: RoutineProductWithDetails[];
}

function reindexTimeBlock(
  notes: RoutineNoteDisplay[],
  timeOfDay: TimeOfDay,
): RoutineNoteDisplay[] {
  const block = notes
    .filter((n) => n.timeOfDay === timeOfDay)
    .sort((a, b) => a.stepOrder - b.stepOrder);
  const stepMap = new Map(
    block.map((n, i) => [`${n.productId}-${timeOfDay}`, i + 1]),
  );
  return notes.map((n) =>
    n.timeOfDay === timeOfDay
      ? {
          ...n,
          stepOrder: stepMap.get(`${n.productId}-${timeOfDay}`) ?? n.stepOrder,
        }
      : n,
  );
}

function normalizeNoteStepOrder(notes: RoutineNoteDisplay[]): RoutineNoteDisplay[] {
  return reindexTimeBlock(reindexTimeBlock(notes, "AM"), "PM");
}

function noteStateKey(productId: number, timeOfDay: TimeOfDay): string {
  return `${productId}-${timeOfDay}`;
}

function buildNoteUpdates(
  notes: RoutineNoteDisplay[],
  initialProducts: RoutineProductWithDetails[],
): RoutineNoteUpdate[] {
  const notesByKey = new Map<string, RoutineNoteDisplay>();
  for (const n of notes) {
    notesByKey.set(noteStateKey(n.productId, n.timeOfDay), n);
  }

  const junctionByProductId = new Map<number, RoutineProductWithDetails>();
  for (const rp of initialProducts) {
    if (!junctionByProductId.has(rp.productId)) {
      junctionByProductId.set(rp.productId, rp);
    }
  }

  const updates: RoutineNoteUpdate[] = [];

  for (const productId of junctionByProductId.keys()) {
    const junction = junctionByProductId.get(productId)!;
    const amRow = notesByKey.get(noteStateKey(productId, "AM"));
    const pmRow = notesByKey.get(noteStateKey(productId, "PM"));

    const nextAm = amRow ? amRow.userNote.trim() || null : null;
    const nextPm = pmRow ? pmRow.userNote.trim() || null : null;
    const nextAmStep = amRow?.stepOrder ?? null;
    const nextPmStep = pmRow?.stepOrder ?? null;

    const prevAm = junction.amNote?.trim() || null;
    const prevPm = junction.pmNote?.trim() || null;
    const prevAmStep = junction.amStepOrder;
    const prevPmStep = junction.pmStepOrder;

    const patch: RoutineNoteUpdate = { productId };
    let changed = false;

    if (nextAm !== prevAm) {
      patch.amNote = nextAm;
      changed = true;
    }
    if (nextAmStep !== prevAmStep) {
      patch.amStepOrder = nextAmStep;
      changed = true;
    }
    if (nextPm !== prevPm) {
      patch.pmNote = nextPm;
      changed = true;
    }
    if (nextPmStep !== prevPmStep) {
      patch.pmStepOrder = nextPmStep;
      changed = true;
    }

    if (changed) updates.push(patch);
  }

  return updates;
}

export default function RoutineUsageNotesEditor({
  routineId,
  canEdit,
  initialProducts,
}: RoutineUsageNotesEditorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const initialNotes = useMemo(
    () =>
      normalizeNoteStepOrder(hydrateRoutineProductNotesFromApi(initialProducts)),
    [initialProducts],
  );
  const [notes, setNotes] = useState<RoutineNoteDisplay[]>(initialNotes);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const productInfoById = useMemo(() => {
    const map = new Map<
      number,
      { name: string; brand: string; category: ProductCategory }
    >();
    for (const rp of initialProducts) {
      if (!rp.product || map.has(rp.productId)) continue;
      map.set(rp.productId, {
        name: rp.product.name,
        brand: rp.product.brand,
        category: effectiveRoutineProductCategory(rp),
      });
    }
    return map;
  }, [initialProducts]);

  const modalProducts = useMemo(() => {
    return [...productInfoById.entries()].map(([productId, info]) => ({
      productId,
      name: info.name,
      brand: info.brand,
      category: info.category,
    }));
  }, [productInfoById]);

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

  const hasNoteChanges = useMemo(() => {
    const normalize = (rows: RoutineNoteDisplay[]) =>
      rows
        .map((n) => ({
          productId: n.productId,
          timeOfDay: n.timeOfDay,
          stepOrder: n.stepOrder,
          userNote: n.userNote,
        }))
        .sort((a, b) =>
          noteStateKey(a.productId, a.timeOfDay).localeCompare(
            noteStateKey(b.productId, b.timeOfDay),
          ),
        );
    return (
      JSON.stringify(normalize(notes)) !== JSON.stringify(normalize(initialNotes))
    );
  }, [notes, initialNotes]);

  const addNote = useCallback(
    (
      productId: number,
      category: ProductCategory,
      timeOfDay: TimeOfDay,
      userNote: string,
    ) => {
      const info = productInfoById.get(productId);
      if (!info) return;
      setNotes((prev) => {
        if (
          prev.some(
            (n) => n.productId === productId && n.timeOfDay === timeOfDay,
          )
        ) {
          return prev;
        }
        const stepOrder =
          prev.filter((n) => n.timeOfDay === timeOfDay).length + 1;
        return reindexTimeBlock(
          [
            ...prev,
            {
              productId,
              timeOfDay,
              stepOrder,
              userNote,
              productName: info.name,
              productBrand: info.brand,
              category,
            },
          ],
          timeOfDay,
        );
      });
    },
    [productInfoById],
  );

  const updateNote = useCallback(
    (productId: number, timeOfDay: TimeOfDay, next: string) => {
      setNotes((prev) =>
        prev.map((n) =>
          n.productId === productId && n.timeOfDay === timeOfDay
            ? { ...n, userNote: next }
            : n,
        ),
      );
    },
    [],
  );

  const removeNote = useCallback((productId: number, timeOfDay: TimeOfDay) => {
    setNotes((prev) => {
      const filtered = prev.filter(
        (n) => !(n.productId === productId && n.timeOfDay === timeOfDay),
      );
      return reindexTimeBlock(filtered, timeOfDay);
    });
  }, []);

  const handleSaveNotes = useCallback(async () => {
    if (!hasNoteChanges) return;
    setIsSaving(true);
    setError("");
    try {
      const updates = buildNoteUpdates(notes, initialProducts);
      if (updates.length === 0) return;
      await saveRoutineNotes(routineId, updates);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update usage notes.");
    } finally {
      setIsSaving(false);
    }
  }, [hasNoteChanges, initialProducts, notes, routineId, router]);

  if (!canEdit) return null;

  return (
    <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-zinc-900">
            Routine Product notes update
          </h3>
          <p className="text-sm text-zinc-500">
            Add or edit usage notes for products in this routine. Use the buttons
            below to pick a product.
          </p>
        </div>
        <Button
          onClick={handleSaveNotes}
          disabled={isSaving || !hasNoteChanges}
          variant="secondary"
        >
          <Save className="mr-2 h-4 w-4" />
          Save notes
        </Button>
      </div>

      <BuilderProductNotesSection
        modalProducts={modalProducts}
        morningNotes={morningNotes}
        eveningNotes={eveningNotes}
        onAddNote={addNote}
        onUpdateNote={updateNote}
        onRemoveNote={removeNote}
      />
      {error ? <p className="mt-3 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
