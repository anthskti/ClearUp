"use client";

import { memo, useMemo, useState } from "react";
import { Book } from "lucide-react";
import type { RoutineNoteDisplay } from "@/types/builder";
import type { ProductCategory } from "@/types/product";
import type { TimeOfDay } from "@/types/routine";
import AddProductNoteModal, {
  type ModalProductOption,
} from "./AddProductNoteModal";
import RoutineNoteItemHeader from "./RoutineNoteItemHeader";

interface BuilderProductNotesSectionProps {
  modalProducts: ModalProductOption[];
  morningNotes: RoutineNoteDisplay[];
  eveningNotes: RoutineNoteDisplay[];
  onAddNote: (
    productId: number,
    category: ProductCategory,
    timeOfDay: TimeOfDay,
    userNote: string,
  ) => void;
  onUpdateNote: (productId: number, timeOfDay: TimeOfDay, userNote: string) => void;
  onRemoveNote: (productId: number, timeOfDay: TimeOfDay) => void;
}

const NoteColumn = memo(function NoteColumn({
  title,
  accentClass,
  dotClass,
  timeOfDay,
  notes,
  onAddClick,
  onUpdateNote,
  onRemoveNote,
}: {
  title: string;
  accentClass: string;
  dotClass: string;
  timeOfDay: TimeOfDay;
  notes: RoutineNoteDisplay[];
  onAddClick: () => void;
  onUpdateNote: (productId: number, timeOfDay: TimeOfDay, userNote: string) => void;
  onRemoveNote: (productId: number, timeOfDay: TimeOfDay) => void;
}) {
  return (
    <div>
      <div
        className={`flex items-center gap-2 mb-4 ${accentClass} font-bold uppercase text-xs tracking-wider`}
      >
        <div className={`w-2 h-2 rounded-full ${dotClass}`} />
        {title}
      </div>
      <ol className="relative border-l border-zinc-200 ml-3 space-y-6">
        {notes.map((note) => (
          <li key={`${note.productId}-${timeOfDay}`} className="ml-6">
            <span className="absolute -left-1.5 w-3 h-3 bg-zinc-200 rounded-full mt-1.5 ring-4 ring-white" />
            <RoutineNoteItemHeader
              stepOrder={note.stepOrder}
              productName={note.productName}
              productBrand={note.productBrand}
              category={note.category}
            />
            <textarea
              value={note.userNote}
              onChange={(e) =>
                onUpdateNote(note.productId, timeOfDay, e.target.value)
              }
              className="text-sm text-zinc-600 mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-md px-2 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Your usage note for other viewers"
              rows={2}
            />
            <button
              type="button"
              onClick={() => onRemoveNote(note.productId, timeOfDay)}
              className="mt-2 text-xs text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </li>
        ))}
        <li className="ml-6">
          <button
            type="button"
            onClick={onAddClick}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            + Add {timeOfDay} product
          </button>
        </li>
      </ol>
    </div>
  );
});

function BuilderProductNotesSection({
  modalProducts,
  morningNotes,
  eveningNotes,
  onAddNote,
  onUpdateNote,
  onRemoveNote,
}: BuilderProductNotesSectionProps) {
  const [modalTimeOfDay, setModalTimeOfDay] = useState<TimeOfDay | null>(null);

  const amExcluded = useMemo(
    () => morningNotes.map((n) => n.productId),
    [morningNotes],
  );
  const pmExcluded = useMemo(
    () => eveningNotes.map((n) => n.productId),
    [eveningNotes],
  );

  return (
    <>
      <div className="mt-12 bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
        <h3 className="text-lg font-bold text-zinc-900 mb-2 flex items-center gap-2">
          <Book size={20} /> User Routine notes
        </h3>
        <p className="text-sm text-zinc-500 mb-6">
          Optional: add routine product notes for products you want to explain. Use the
          buttons below to pick a product from your routine grid.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <NoteColumn
            title="Morning"
            accentClass="text-amber-500"
            dotClass="bg-amber-500"
            timeOfDay="AM"
            notes={morningNotes}
            onAddClick={() => setModalTimeOfDay("AM")}
            onUpdateNote={onUpdateNote}
            onRemoveNote={onRemoveNote}
          />
          <NoteColumn
            title="Night"
            accentClass="text-violet-500"
            dotClass="bg-violet-500"
            timeOfDay="PM"
            notes={eveningNotes}
            onAddClick={() => setModalTimeOfDay("PM")}
            onUpdateNote={onUpdateNote}
            onRemoveNote={onRemoveNote}
          />
        </div>
      </div>

      <AddProductNoteModal
        isOpen={modalTimeOfDay !== null}
        onClose={() => setModalTimeOfDay(null)}
        timeOfDay={modalTimeOfDay ?? "AM"}
        products={modalProducts}
        excludedProductIds={
          modalTimeOfDay === "PM" ? pmExcluded : amExcluded
        }
        onConfirm={(productId, category, userNote) => {
          if (modalTimeOfDay) {
            onAddNote(productId, category, modalTimeOfDay, userNote);
          }
        }}
      />
    </>
  );
}

export default memo(BuilderProductNotesSection);
