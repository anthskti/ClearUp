"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, Loader2, Save, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateRoutineById } from "@/lib/routines";
import type { SkinType } from "@/types/product";
import RoutineSkinTypeTagPicker from "./RoutineSkinTypeTagPicker";

interface RoutineDetailsEditorProps {
  routineId: number;
  canEdit: boolean;
  initialName: string;
  initialDescription?: string;
  initialTags: SkinType[];
}

export default function RoutineDetailsEditor({
  routineId,
  canEdit,
  initialName,
  initialDescription,
  initialTags,
}: RoutineDetailsEditorProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [tags, setTags] = useState<SkinType[]>(() => [...initialTags]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const initialTagsKey = useMemo(() => [...initialTags].sort().join(","), [initialTags]);
  const selectedTagsKey = useMemo(() => [...tags].sort().join(","), [tags]);
  const hasChanges =
    name.trim() !== initialName ||
    description !== (initialDescription ?? "") ||
    selectedTagsKey !== initialTagsKey;

  const toggleTag = useCallback((tag: SkinType) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  const saveMeta = useCallback(async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    setError("");
    try {
      await updateRoutineById(routineId, {
        name: name.trim() || initialName,
        description,
        skinTypeTags: tags,
      });
      setIsOpen(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update details.");
    } finally {
      setIsSaving(false);
    }
  }, [hasChanges, routineId, name, initialName, description, tags, router]);

  if (!canEdit) return null;

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Edit3 size={16} className="mr-2" />
        Edit details
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg border border-zinc-200 bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-zinc-900">
              Edit routine details
            </h3>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
              Routine name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4 w-full rounded-md border border-zinc-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mb-4 w-full rounded-md border border-zinc-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
              <Tags size={14} />
              Skin Type for this Routine
            </div>
            <RoutineSkinTypeTagPicker value={tags} onToggle={toggleTag} />
            {error ? <p className="mt-3 text-xs text-red-600">{error}</p> : null}
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={saveMeta}
                disabled={isSaving || !hasChanges}
                variant="secondary"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // TODO: Update to themed icon bounce loader
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save details
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
