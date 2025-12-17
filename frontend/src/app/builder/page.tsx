"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Copy, Plus, ExternalLink, X, Book, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProceduralWave from "@/components/themes/ProceduralWave";
import { createRoutine } from "@/lib/routines";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBuilderRoutine } from "@/hooks/useBuilderRoutine";
import { useBuilderNotes } from "@/hooks/useBuilderNotes";

export default function Builder() {
  const {
    routine,
    isLoaded: routineLoaded,
    removeProductFromSlot,
    clearRoutine,
  } = useBuilderRoutine();
  const {
    notes,
    isLoaded: notesLoaded,
    updateNote,
    addNote,
    removeNote,
    clearNotes,
  } = useBuilderNotes();

  const [savedRoutineId, setSavedRoutineId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save every selected product from each slot as its own item
      const items = routine.flatMap((slot) =>
        (slot.products || []).map((p) => ({
          productId: p.id,
          category: slot.id,
        }))
      );

      if (items.length === 0) {
        setIsSaving(false);
        return;
      }

      // TODO: Get userId from session/auth
      const userId = 1; // Placeholder

      // Store notes as JSON string in description field
      const notesJson = JSON.stringify(notes);

      const routineData = await createRoutine({
        name: `My Routine ${new Date().toLocaleDateString()}`,
        description: notesJson,
        userId,
        items,
      });

      setSavedRoutineId(routineData.id);

      // Clear local storage after saving
      clearRoutine();
      clearNotes();

      // Show success and update the link
      alert(`Routine saved successfully! ID: ${routineData.id}`);

      // Optionally redirect to a routine view page if it exists
      // router.push(`/routine/${routineData.id}`);
    } catch (error: any) {
      console.error("Failed to save routine:", error);
      alert(`Failed to save routine: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const copyLink = () => {
    if (typeof window !== "undefined") {
      const url = savedRoutineId
        ? `${window.location.origin}/routine/${savedRoutineId}`
        : window.location.href;
      navigator.clipboard.writeText(url);
      // You could add a toast notification here
    }
  };

  const totalPrice = routine.reduce(
    (acc, step) => acc + step.products.reduce((s, p) => s + (p.price || 0), 0),
    0
  );
  const totalItems = routine.reduce(
    (acc, step) => acc + step.products.length,
    0
  );

  // Don't render until hooks are loaded
  if (!routineLoaded || !notesLoaded) {
    return (
      <div className="relative min-h-screen w-full bg-[#F8F8F8] flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#F8F8F8]">
      <ProceduralWave seed={3} height={190} />
      <div className="relative z-1 max-w-6xl mx-auto px-6 pt-20 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2E2E2E] uppercase">
            Build Your Routine.
          </h1>

          {/* External Link */}
          <div className="flex items-center bg-white border border-zinc-200 rounded-md overflow-hidden shadow-sm max-w-md w-full md:w-auto">
            <div className="bg-zinc-50 px-3 py-2 border-r border-zinc-200 text-zinc-400">
              <ExternalLink size={16} />
            </div>
            <input
              readOnly
              value={
                typeof window !== "undefined"
                  ? savedRoutineId
                    ? `${window.location.origin}/routine/${savedRoutineId}`
                    : window.location.href
                  : ""
              }
              className="px-3 py-2 text-sm text-zinc-600 outline-none w-full md:w-64 bg-transparent"
            />
            <button
              onClick={copyLink}
              className="px-4 py-2 hover:bg-zinc-50 border-l border-zinc-200 transition-colors"
            >
              <Copy size={16} className="text-zinc-500 hover:text-black" />
            </button>
          </div>
        </div>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-12 gap-4 text-zinc-500 font-bold uppercase text-xs border-b border-zinc-200 px-2 pb-2 mb-2">
          <div className="col-span-2">Category</div>
          <div className="col-span-7">Product Selection</div>
          <div className="col-span-2">Merchant</div>
          <div className="col-span-1 text-right">Price</div>
        </div>

        {/* Builder */}
        <div className="space-y-4 md:space-y-0">
          {routine.map((step) => (
            <div
              key={step.id}
              className={`
              group bg-white rounded-xl border border-zinc-200 shadow-sm p-4 grid grid-cols-1 gap-4 items-center transition-all hover:bg-zinc-50/50
              md:bg-transparent md:rounded-none md:border-0 md:border-b md:border-zinc-200 md:shadow-none md:px-2 md:py-5 md:grid-cols-12 
              `}
            >
              {/* Category Label */}
              <div className="col-span-1 md:col-span-2 flex justify-between md:block">
                <Link href={`/products/category/${step.id}`}>
                  <span className="font-bold text-zinc-900 uppercase text-sm md:text-xs tracking-wide hover:text-zinc-500 transition-colors">
                    {step.label}
                  </span>
                </Link>
                {/* Mobile Price Display */}
                {step.products && step.products.length > 0 && (
                  <span className="md:hidden font-bold text-zinc-900">
                    $
                    {step.products
                      .reduce((s, p) => s + (p.price || 0), 0)
                      .toFixed(2)}
                  </span>
                )}
              </div>

              {/* Selection Area */}
              <div className="col-span-1 md:col-span-7">
                {step.products && step.products.length > 0 ? (
                  // FILLED STATE (render multiple products)
                  <div className="flex flex-col gap-4">
                    {step.products.map((prod) => (
                      <div key={prod.id} className="flex items-center gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-100 rounded-md border border-zinc-200 shrink-0 overflow-hidden">
                          {prod.imageUrls && prod.imageUrls[0] ? (
                            <Image
                              src={prod.imageUrls[0]}
                              alt={prod.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                              unoptimized={true}
                            />
                          ) : (
                            <div className="w-full h-full bg-zinc-200" />
                          )}
                        </div>

                        <div className="grow min-w-0">
                          <div className="text-xs font-bold text-zinc-400 uppercase mb-0.5">
                            {prod.brand}
                          </div>
                          <Link
                            href={`/product/id/${prod.id}`}
                            className="font-medium text-black leading-tight hover:underline hover:text-blue-800 block transition-all duration-100"
                          >
                            {prod.name}
                          </Link>
                          {/* Mobile Merchant Display */}
                          <div className="md:hidden text-xs text-zinc-500 mt-1 flex items-center gap-1">
                            via {prod.merchant || "Unknown"}{" "}
                            <ExternalLink size={10} />
                          </div>
                        </div>

                        <div className="shrink-0">
                          <button
                            onClick={() =>
                              removeProductFromSlot(step.id, prod.id)
                            }
                            className={`top-2 right-2 group-hover:block p-2 text-zinc-300 hover:text-red-500 transition-colors md:relative md:top-auto md:right-auto`}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // EMPTY STATE (Dashed Slot)
                  <Link href={`/products/category/${step.id}`}>
                    <div className="w-full h-14 md:h-16 border-2 border-dashed border-zinc-300 rounded-lg flex items-center justify-center gap-2 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-all cursor-pointer">
                      <Plus size={18} />
                      <span className="font-medium text-sm">
                        Select {step.label}
                      </span>
                    </div>
                  </Link>
                )}
              </div>

              {/* Merchant Column (Desktop Only) */}
              <div className="hidden md:flex col-span-2 items-center">
                {step.products && step.products.length > 0 && (
                  <div className="flex flex-col gap-8">
                    {step.products.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex items-center gap-2 p-3 bg-white border border-zinc-200 rounded text-xs font-bold text-zinc-700 shadow-sm"
                      >
                        {prod.merchantLogo &&
                        prod.merchantLogo !== "/placeholder-logo.png" ? (
                          <Image
                            src={prod.merchantLogo || ""}
                            alt={prod.merchant || "Unknown Merchant"}
                            width={20}
                            height={20}
                            className="object-cover"
                            unoptimized={true}
                          />
                        ) : (
                          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[10px] text-blue-700">
                            -
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Column (Desktop Only) */}
              <div className="hidden md:block col-span-1 text-right">
                {step.products && step.products.length > 0 ? (
                  <div className="flex flex-col items-end gap-13">
                    {step.products.map((p) => (
                      <div
                        key={p.id}
                        className="text-lg font-bold text-zinc-900"
                      >
                        ${""}
                        {(p.price || 0).toFixed(2)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-zinc-200 font-medium">---</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          className={`
          bottom-0 left-0 w-full bg-white border border-zinc-200 shadow-md rounded-lg mt-4 z-40 px-6 py-4
          lg:top-20 lg:bottom-auto lg:shadow-sm 
          `}
        >
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <div className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
                Estimated Total
              </div>
              <div className="text-2xl font-extrabold text-black">
                CA ${totalPrice.toFixed(2)}
              </div>
            </div>
            <div className="flex gap-3">
              <span className="hidden sm:flex items-center text-sm font-medium text-zinc-500 mr-2">
                {totalItems} items selected
              </span>
              <Button
                variant="secondary"
                onClick={handleSave}
                disabled={isSaving || totalItems === 0}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* User instructions card */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
          <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
            <Book size={20} /> Users Notes:
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Morning Notes */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-amber-500 font-bold uppercase text-xs tracking-wider">
                <div className="w-2 h-2 rounded-full bg-amber-500" /> Morning
              </div>
              <ol className="relative border-l border-zinc-200 ml-3 space-y-6">
                {notes.morning.map((note, index) => (
                  <li key={index} className="ml-6">
                    <span className="absolute -left-1.5 w-3 h-3 bg-zinc-200 rounded-full mt-1.5 ring-4 ring-white" />
                    <input
                      type="text"
                      value={note.title}
                      onChange={(e) =>
                        updateNote("morning", index, "title", e.target.value)
                      }
                      className="font-bold text-zinc-900 text-sm w-full bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                      placeholder="Note title"
                    />
                    <textarea
                      value={note.description}
                      onChange={(e) =>
                        updateNote(
                          "morning",
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="text-sm text-zinc-500 mt-1 w-full bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 resize-none"
                      placeholder="Note description"
                      rows={2}
                    />
                    <button
                      onClick={() => removeNote("morning", index)}
                      className="mt-2 text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
                <li className="ml-6">
                  <button
                    onClick={() => addNote("morning")}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Add Note
                  </button>
                </li>
              </ol>
            </div>

            {/* Evening Notes */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-violet-500 font-bold uppercase text-xs tracking-wider">
                <div className="w-2 h-2 rounded-full bg-violet-500" /> Night
              </div>
              <ol className="relative border-l border-zinc-200 ml-3 space-y-6">
                {notes.evening.map((note, index) => (
                  <li key={index} className="ml-6">
                    <span className="absolute -left-1.5 w-3 h-3 bg-zinc-200 rounded-full mt-1.5 ring-4 ring-white" />
                    <input
                      type="text"
                      value={note.title}
                      onChange={(e) =>
                        updateNote("evening", index, "title", e.target.value)
                      }
                      className="font-bold text-zinc-900 text-sm w-full bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                      placeholder="Note title"
                    />
                    <textarea
                      value={note.description}
                      onChange={(e) =>
                        updateNote(
                          "evening",
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="text-sm text-zinc-500 mt-1 w-full bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 resize-none"
                      placeholder="Note description"
                      rows={2}
                    />
                    <button
                      onClick={() => removeNote("evening", index)}
                      className="mt-2 text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
                <li className="ml-6">
                  <button
                    onClick={() => addNote("evening")}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Add Note
                  </button>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
