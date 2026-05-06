"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Book, Loader2, Save } from "lucide-react";
import { updateRoutineById } from "@/lib/routines";
import type { ClientNotes } from "@/hooks/useBuilderNotes";

interface RoutineDescriptionEditorProps {
  routineId: number;
  initialDescription?: string;
  canEdit: boolean;
}

type TimeOfDay = "morning" | "evening";

const DEFAULT_NOTES: ClientNotes = {
  morning: [],
  evening: [],
};

function parseNotes(description?: string): ClientNotes {
  if (!description) return DEFAULT_NOTES;
  try {
    const parsed = JSON.parse(description) as Partial<ClientNotes>;
    return {
      morning: Array.isArray(parsed.morning) ? parsed.morning : [],
      evening: Array.isArray(parsed.evening) ? parsed.evening : [],
    };
  } catch {
    return DEFAULT_NOTES;
  }
}

export default function RoutineDescriptionEditor({
  routineId,
  initialDescription,
  canEdit,
}: RoutineDescriptionEditorProps) {
  const router = useRouter();
  const [notes, setNotes] = useState<ClientNotes>(() =>
    parseNotes(initialDescription),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const serializedNotes = useMemo(() => JSON.stringify(notes), [notes]);
  const initialSerialized = useMemo(
    () => JSON.stringify(parseNotes(initialDescription)),
    [initialDescription],
  );
  const hasChanges = serializedNotes !== initialSerialized;

  const updateNote = (
    timeOfDay: TimeOfDay,
    index: number,
    field: "title" | "description",
    value: string,
  ) => {
    setNotes((prev) => ({
      ...prev,
      [timeOfDay]: prev[timeOfDay].map((note, i) =>
        i === index ? { ...note, [field]: value } : note,
      ),
    }));
  };

  const addNote = (timeOfDay: TimeOfDay) => {
    setNotes((prev) => ({
      ...prev,
      [timeOfDay]: [...prev[timeOfDay], { title: "New Note", description: "" }],
    }));
  };

  const removeNote = (timeOfDay: TimeOfDay, index: number) => {
    setNotes((prev) => ({
      ...prev,
      [timeOfDay]: prev[timeOfDay].filter((_, i) => i !== index),
    }));
  };

  const saveNotes = async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    setError("");
    try {
      await updateRoutineById(routineId, { description: serializedNotes });
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to save routine notes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-12 bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
          <Book size={20} /> Users Notes:
        </h3>
        {canEdit && (
          <button
            onClick={saveNotes}
            disabled={isSaving || !hasChanges}
            className="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-60 transition-all duration-300"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save notes
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {(["morning", "evening"] as TimeOfDay[]).map((timeOfDay) => {
          const accent =
            timeOfDay === "morning"
              ? "text-amber-500 bg-amber-500"
              : "text-violet-500 bg-violet-500";
          const sectionTitle = timeOfDay === "morning" ? "Morning" : "Night";
          const sectionNotes = notes[timeOfDay];
          return (
            <div key={timeOfDay}>
              <div
                className={`flex items-center gap-2 mb-4 font-bold uppercase text-xs tracking-wider ${timeOfDay === "morning" ? "text-amber-500" : "text-violet-500"}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${accent.split(" ")[1]}`}
                />{" "}
                {sectionTitle}
              </div>
              {sectionNotes.length > 0 ? (
                <ol className="relative border-l border-zinc-200 ml-3 space-y-6">
                  {sectionNotes.map((note, index) => (
                    <li key={index} className="ml-6">
                      <span className="absolute -left-1.5 w-3 h-3 bg-zinc-200 rounded-full mt-1.5 ring-4 ring-white" />
                      {canEdit ? (
                        <>
                          <input
                            type="text"
                            value={note.title}
                            onChange={(e) =>
                              updateNote(
                                timeOfDay,
                                index,
                                "title",
                                e.target.value,
                              )
                            }
                            className="font-bold text-zinc-900 text-sm w-full bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                            placeholder="Note title"
                          />
                          <textarea
                            value={note.description}
                            onChange={(e) =>
                              updateNote(
                                timeOfDay,
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            className="text-sm text-zinc-500 mt-1 w-full bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 resize-none"
                            placeholder="Note description"
                            rows={2}
                          />
                          <button
                            onClick={() => removeNote(timeOfDay, index)}
                            className="mt-2 text-xs text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <>
                          <h4 className="font-bold text-zinc-900 text-sm">
                            {note.title}
                          </h4>
                          <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                            {note.description}
                          </p>
                        </>
                      )}
                    </li>
                  ))}
                  {canEdit && (
                    <li className="ml-6">
                      <button
                        onClick={() => addNote(timeOfDay)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        + Add Note
                      </button>
                    </li>
                  )}
                </ol>
              ) : canEdit ? (
                <button
                  onClick={() => addNote(timeOfDay)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium ml-4"
                >
                  + Add {sectionTitle} note
                </button>
              ) : (
                <p className="text-sm text-zinc-400 italic ml-4">
                  No {timeOfDay} notes added.
                </p>
              )}
            </div>
          );
        })}
      </div>
      {error && <p className="mt-4 text-xs text-red-600">{error}</p>}
    </div>
  );
}
