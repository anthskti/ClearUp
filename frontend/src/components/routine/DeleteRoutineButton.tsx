"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteRoutineModal from "@/components/routine/DeleteRoutineModal";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  routineId: number;
}

export default function DeleteRoutineButton({ routineId }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="mt-12 flex justify-end">
      <Button onClick={() => setIsModalOpen(true)} variant="destructive">
        <Trash2 size={16} />
        Delete Routine
      </Button>

      <DeleteRoutineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        routineId={routineId}
        onSuccess={() => {
          router.refresh();
          router.push("/profile/created-routines");
        }}
      />
    </div>
  );
}
