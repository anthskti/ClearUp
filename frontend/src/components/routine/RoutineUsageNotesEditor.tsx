"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hydrateProductNotesFromApi } from "@/lib/buildRoutineSaveItems";
import { updateRoutineProductsById } from "@/lib/routines";
import type { RoutineNoteDisplay, RoutineProductInput } from "@/types/builder";
import type { ProductCategory } from "@/types/product";
import type { RoutineProductWithDetails, TimeOfDay } from "@/types/routine";
import BuilderProductNotesSection from "./BuilderProductNotesSection";

interface RoutineUsageNotesEditorProps {
  routineId: number;
  canEdit: boolean;
  initialProducts: RoutineProductWithDetails[];
}

function noteKey(productId: number, timeOfDay: TimeOfDay): string {
  return `${productId}-${timeOfDay}`;
}

function reindexTimeBlock(
  notes: RoutineNoteDisplay[],
  timeOfDay: TimeOfDay,
): RoutineNoteDisplay[] {
  const block = notes
    .filter((n) => n.timeOfDay === timeOfDay)
    .sort((a, b) => a.stepOrder - b.stepOrder);
  const stepMap = new Map(
    block.map((n, i) => [noteKey(n.productId, timeOfDay), i + 1]),
  );
  return notes.map((n) =>
    n.timeOfDay === timeOfDay
      ? {
          ...n,
          stepOrder: stepMap.get(noteKey(n.productId, timeOfDay)) ?? n.stepOrder,
        }
      : n,
  );
}

function normalizeNoteStepOrder(notes: RoutineNoteDisplay[]): RoutineNoteDisplay[] {
  return reindexTimeBlock(reindexTimeBlock(notes, "AM"), "PM");
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
    () => normalizeNoteStepOrder(hydrateProductNotesFromApi(initialProducts)),
    [initialProducts],
  );
  const [notes, setNotes] = useState<RoutineNoteDisplay[]>(initialNotes);

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
        category: rp.category,
      });
    }
    return map;
  }, [initialProducts]);

  const modalProducts = useMemo(() => {
    const seen = new Set<number>();
    return initialProducts
      .filter((rp) => {
        if (!rp.product) return false;
        if (seen.has(rp.productId)) return false;
        seen.add(rp.productId);
        return true;
      })
      .map((rp) => {
        return {
          productId: rp.productId,
          name: rp.product!.name,
          brand: rp.product!.brand,
          category: rp.category,
        };
      });
  }, [initialProducts]);

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
          `${a.productId}-${a.timeOfDay}`.localeCompare(
            `${b.productId}-${b.timeOfDay}`,
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
        if (prev.some((n) => n.productId === productId && n.timeOfDay === timeOfDay)) {
          return prev;
        }
        const stepOrder = prev.filter((n) => n.timeOfDay === timeOfDay).length + 1;
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

  const saveNotes = useCallback(async () => {
    if (!hasNoteChanges) return;
    setIsSaving(true);
    setError("");
    try {
      const noteByKey = new Map(
        notes.map((n) => [noteKey(n.productId, n.timeOfDay), n]),
      );

      // Preserve current routine lineup rows; only update userNote values.
      const items: RoutineProductInput[] = initialProducts.map((rp) => {
        const match = noteByKey.get(noteKey(rp.productId, rp.timeOfDay));
        return {
          productId: rp.productId,
          category: rp.category,
          timeOfDay: rp.timeOfDay,
          stepOrder: rp.stepOrder,
          userNote: match ? match.userNote.trim() || null : null,
        };
      });

      // If a new AM/PM note was added for a missing row, append that row.
      const existingKeys = new Set(
        items.map((i) => noteKey(i.productId, i.timeOfDay ?? "AM")),
      );
      const maxStepByTime = {
        AM: Math.max(
          0,
          ...items
            .filter((i) => i.timeOfDay === "AM")
            .map((i) => i.stepOrder ?? 0),
        ),
        PM: Math.max(
          0,
          ...items
            .filter((i) => i.timeOfDay === "PM")
            .map((i) => i.stepOrder ?? 0),
        ),
      };

      for (const n of notes) {
        const key = noteKey(n.productId, n.timeOfDay);
        if (existingKeys.has(key)) continue;
        maxStepByTime[n.timeOfDay] += 1;
        items.push({
          productId: n.productId,
          category: n.category,
          timeOfDay: n.timeOfDay,
          stepOrder: maxStepByTime[n.timeOfDay],
          userNote: n.userNote.trim() || null,
        });
      }

      await updateRoutineProductsById(routineId, items);
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
          <h3 className="text-lg font-bold text-zinc-900">User Product Notes</h3>
          <p className="text-sm text-zinc-500">
            Update your AM/PM product notes.
          </p>
        </div>
        <Button
          onClick={saveNotes}
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
