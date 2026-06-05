"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SkinType } from "@/types/product";
import RoutineShareLink from "./RoutineShareLink";

export type SaveRoutinePayload = {
  name: string;
  description: string;
  skinTypeTags: SkinType[];
};

interface SaveRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  skinTypeTags: SkinType[];
  onSave: (payload: SaveRoutinePayload) => Promise<number>;
}

function SaveRoutineModal({
  isOpen,
  onClose,
  skinTypeTags,
  onSave,
}: SaveRoutineModalProps) {
  const [routineName, setRoutineName] = useState("");
  const [routineDescription, setRoutineDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedRoutineId, setSavedRoutineId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    setRoutineName("");
    setRoutineDescription("");
    setSavedRoutineId(null);
    setIsSaving(false);
  }, [isOpen]);

  const handleConfirmSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const id = await onSave({
        name: routineName.trim() || "My Skincare Routine",
        description: routineDescription.trim() || "",
        skinTypeTags,
      });
      setSavedRoutineId(id);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred while saving.",
      );
    } finally {
      setIsSaving(false);
    }
  }, [routineName, routineDescription, skinTypeTags, onSave]);

  const handleCloseAfterSave = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSaving && !savedRoutineId) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        {!isSaving && !savedRoutineId && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Success View */}
        {savedRoutineId ? (
          <div className="flex flex-col items-center text-center py-4">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <div className="text-xl font-bold mb-2">Routine Saved!</div>
            <div className="text-sm text-zinc-500 mb-3">
              Your routine has been successfully saved to your profile.
            </div>
            <Button
              variant="outline"
              className="border-zinc-200 shadow-sm w-full"
              onClick={handleCloseAfterSave}
            >
              Close
            </Button>
            {/* External Link */}
            <div className="my-3 border-b border-zinc-200 w-full" />
            <div className="text-sm text-zinc-500 mb-3">
              Share with friends with this link!
            </div>
            <RoutineShareLink routineId={String(savedRoutineId)} />
          </div>
        ) : (
          <div>
            <div className="text-xl font-bold mb-3">Name Your Routine</div>
            <input
              type="text"
              autoFocus
              placeholder="glass skin routine"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              className="w-full text-sm p-2 border border-zinc-200 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-black"
              disabled={isSaving}
            />
            <div className="text-lg font-bold mb-3">Routine Description</div>
            <textarea
              placeholder="inspired by glass skin, this routine..."
              value={routineDescription}
              rows={2}
              onChange={(e) => setRoutineDescription(e.target.value)}
              className="w-full text-sm p-2 border border-zinc-200 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-black"
              disabled={isSaving}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={handleConfirmSave}
                disabled={isSaving}
              >
                Save Routine
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,  // Put the portal at the front of the DOM
  );
}

export default memo(SaveRoutineModal); // Memoize to avoid re-rendering when not needed.
