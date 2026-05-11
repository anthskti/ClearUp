"use client";
import { useState } from "react";
import { deleteRoutineById } from "@/lib/routines";
import { Button } from "@/components/ui/button";

import { AlertTriangle, X } from "lucide-react";

interface DeleteRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  routineId: number;
  onSuccess: () => void;
}

export default function DeleteRoutineModal({
  isOpen,
  onClose,
  routineId,
  onSuccess,
}: DeleteRoutineModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  if (!isOpen) return null;

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteRoutineById(routineId);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("An error occured while deleting your routine.");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>
        <div>
          <div className="flex flex-col items-center text-center py-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-xl font-bold mb-2">Delete your Routine?</div>
          <div className="text-sm text-zinc-500 mb-6">
            Are you sure you want to delete this routine? This action cannot be
            undone and will permanently remove it from your profile.
          </div>
          <div className="flex flex-col items-center text-center py-2">
            <Button
              variant="destructive"
              //   className="border-zinc-200 shadow-sm w-full"
              onClick={handleConfirmDelete}
            >
              Delete Routine
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
