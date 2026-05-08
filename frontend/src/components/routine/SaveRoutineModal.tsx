"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, CheckCircle, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SkinType } from "@/types/product";
import { createRoutine } from "@/lib/routines";
import RoutineShareLink from "./RoutineShareLink";

interface SaveRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  routineData: any[]; // The extracted products
  notesData: any; // The extracted notes
  skinTypeTags: SkinType[];
  onSuccess: () => void; // The magic callback to clear the parent hooks!
}

export default function SaveRoutineModal({
  isOpen,
  onClose,
  routineData,
  notesData,
  skinTypeTags,
  onSuccess,
}: SaveRoutineModalProps) {
  const router = useRouter();
  const [routineName, setRoutineName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedRoutineId, setSavedRoutineId] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleConfirmSave = async () => {
    setIsSaving(true);
    try {
      // Replace with your actual API call
      const response = await createRoutine({
        name: routineName.trim() || "My Skincare Routine",
        description: JSON.stringify(notesData),
        skinTypeTags,
        items: routineData,
      });

      setSavedRoutineId(response.id);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        {!isSaving && !savedRoutineId && (
          <button
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
              onClick={onClose}
            >
              Close
            </Button>
            <div className=" my-3 border-b border-zinc-200 w-full"></div>
            {/* External Link */}
            <div className="text-sm text-zinc-500 mb-3">
              Share with friends with this link!
            </div>
            <RoutineShareLink routineId={String(savedRoutineId)} />
          </div>
        ) : (
          /* Input View */
          <div>
            <div className="text-xl font-bold mb-3">Name Your Routine</div>
            <input
              type="text"
              autoFocus
              placeholder="clearup glass skin routine"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
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
    </div>
  );
}
