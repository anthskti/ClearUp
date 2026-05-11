"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Tags } from "lucide-react";
import { updateRoutineById } from "@/lib/routines";
import type { SkinType } from "@/types/product";
import RoutineSkinTypeTagPicker from "./RoutineSkinTypeTagPicker";

interface RoutineSkinTypeTagsEditorProps {
  routineId: number;
  initialTags: SkinType[];
  canEdit: boolean;
}

export default function RoutineSkinTypeTagsEditor({
  routineId,
  initialTags,
  canEdit,
}: RoutineSkinTypeTagsEditorProps) {
  const router = useRouter();
  const [tags, setTags] = useState<SkinType[]>(() => [...initialTags]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const initialKey = useMemo(() => [...initialTags].sort().join(), [initialTags]);
  const selectedKey = useMemo(() => [...tags].sort().join(), [tags]);
  const hasChanges = selectedKey !== initialKey;

  const toggle = (t: SkinType) => {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  const save = async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    setError("");
    try {
      await updateRoutineById(routineId, { skinTypeTags: tags });
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save skin types.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!canEdit && initialTags.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
          <Tags size={20} /> Routine Skin Types:
        </h3>
        {canEdit && (
          <button
            type="button"
            onClick={save}
            disabled={isSaving || !hasChanges}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-all duration-300 hover:bg-emerald-100 disabled:opacity-60"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save tags
          </button>
        )}
      </div>
      <p className="mb-4 text-sm text-zinc-500">
        Help others find this guide. Tags match product skin type categories.
      </p>
      <RoutineSkinTypeTagPicker
        value={tags}
        onToggle={toggle}
        disabled={!canEdit}
      />
      {error && <p className="mt-4 text-xs text-red-600">{error}</p>}
    </div>
  );
}
