import { Book } from "lucide-react";
import { hydrateProductNotesFromApi } from "@/lib/buildRoutineSaveItems";
import type { RoutineNoteDisplay } from "@/types/builder";
import type { RoutineProductWithDetails, TimeOfDay } from "@/types/routine";
import RoutineNoteItemHeader from "./RoutineNoteItemHeader";

function sortNotes(notes: RoutineNoteDisplay[], timeOfDay: TimeOfDay) {
  return notes
    .filter((n) => n.timeOfDay === timeOfDay)
    .sort((a, b) => a.stepOrder - b.stepOrder);
}

function NoteColumn({
  title,
  accentClass,
  dotClass,
  notes,
}: {
  title: string;
  accentClass: string;
  dotClass: string;
  notes: RoutineNoteDisplay[];
}) {
  if (notes.length === 0) return null;

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
          <li key={`${note.productId}-${note.timeOfDay}`} className="ml-6">
            <span className="absolute -left-1.5 w-3 h-3 bg-zinc-200 rounded-full mt-1.5 ring-4 ring-white" />
            <RoutineNoteItemHeader
              stepOrder={note.stepOrder}
              productName={note.productName}
              productBrand={note.productBrand}
              category={note.category}
            />
            {note.userNote.trim() ? (
              <p className="text-sm text-zinc-600 whitespace-pre-wrap">
                {note.userNote}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

interface RoutineProductNotesViewProps {
  products: RoutineProductWithDetails[];
}

export default function RoutineProductNotesView({
  products,
}: RoutineProductNotesViewProps) {
  const displayNotes = hydrateProductNotesFromApi(products);
  const amNotes = sortNotes(displayNotes, "AM");
  const pmNotes = sortNotes(displayNotes, "PM");

  if (amNotes.length === 0 && pmNotes.length === 0) return null;

  return (
    <div className="mt-12 bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
      <h3 className="text-lg font-bold text-zinc-900 mb-2 flex items-center gap-2">
        <Book size={20} /> Usage notes
      </h3>
      <p className="text-sm text-zinc-500 mb-6">
        Optional tips for how products are used. All products in this routine
        are listed above, even when they do not have a note here.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        <NoteColumn
          title="Morning"
          accentClass="text-amber-500"
          dotClass="bg-amber-500"
          notes={amNotes}
        />
        <NoteColumn
          title="Night"
          accentClass="text-violet-500"
          dotClass="bg-violet-500"
          notes={pmNotes}
        />
      </div>
    </div>
  );
}
