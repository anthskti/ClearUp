import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Copy, ExternalLink, Book } from "lucide-react";
import ProceduralWave from "@/components/themes/ProceduralWave";
import { getRoutineWithProducts } from "@/lib/routines";
import { ClientNotes } from "@/hooks/useBuilderNotes";

interface RoutineProps {
  params: Promise<{ id: string }>;
}

const ROUTINE_SLOTS = [
  { id: "cleanser", label: "Cleanser" },
  { id: "toner", label: "Toner" },
  { id: "essence", label: "Essence" },
  { id: "serum", label: "Serum" },
  { id: "moisturizer", label: "Moisturizer" },
  { id: "sunscreen", label: "Sunscreen" },
];

export default async function ViewRoutine({ params }: RoutineProps) {
  const { id } = await params;

  const routineData = await getRoutineWithProducts(id);

  if (!routineData) {
    return <div>Routine not found</div>;
  }

  let notes: ClientNotes = { morning: [], evening: [] };
  try {
    if (routineData.description) {
      notes = JSON.parse(routineData.description);
    }
  } catch (e: any) {
    console.error("Failed to parse routine notes", e);
  }

  const finalRoutine = ROUTINE_SLOTS.map((slot) => {
    const matchedItem =
      routineData.products?.filter((p) => p.category === slot.id) || [];
    const products = matchedItem.map((item) => item.product).filter((p) => !!p);
    return {
      ...slot,
      products,
    };
  }).filter((step) => step.products.length > 0);

  const totalPrice = finalRoutine.reduce(
    (acc, step) =>
      acc + step.products.reduce((sum, p) => sum + (p.price || 0), 0),
    0
  );
  const totalItems = finalRoutine.reduce(
    (acc, step) => acc + step.products.length,
    0
  );

  return (
    <div className="relative min-h-screen w-full bg-[#F8F8F8]">
      <ProceduralWave seed={123} height={190} />
      <div className="relative z-1 max-w-6xl mx-auto px-6 pt-20 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2E2E2E] uppercase">
            Viewing Routine
            <div className="text-lg text-zinc-500">{routineData.name}</div>
          </h1>

          {/* External Link */}
          <div className="flex items-center bg-white border border-zinc-200 rounded-md overflow-hidden shadow-sm max-w-md w-full md:w-auto">
            <div className="bg-zinc-50 px-3 py-2 border-r border-zinc-200 text-zinc-400">
              <ExternalLink size={16} />
            </div>
            <input
              readOnly
              value={`clearup.ca/routines/${id}`}
              className="px-4 py-2 text-sm text-zinc-600 outline-none w-full md:w-64 bg-transparent"
            />
            <button className="px-4 py-2 hover:bg-zinc-50 border-l border-zinc-200 transition-colors">
              <Copy size={16} className="text-zinc-500" />
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

        {/* Showing Route */}
        <div className="space-y-4 md:space-y-0">
          {finalRoutine.map((step) => (
            <div
              key={step.id}
              className={`
              group bg-white rounded-xl border border-zinc-200 shadow-sm p-4 grid grid-cols-1 gap-4 items-center transition-all hover:bg-zinc-50/50
              md:bg-transparent md:rounded-none md:border-0 md:border-b md:border-zinc-200 md:shadow-none md:px-2 md:py-5 md:grid-cols-12 
              `}
            >
              {/* Category Label */}
              <div className="col-span-1 md:col-span-2 flex justify-between md:block">
                <span className="font-bold text-zinc-900 uppercase text-sm md:text-xs tracking-wide">
                  {step.label}
                </span>
                {/* Mobile Price Display */}
                {step.products.length > 0 && (
                  <span className="md:hidden font-bold text-zinc-900">
                    $
                    {step.products
                      .reduce((s, p) => s + p.price || 0, 0)
                      .toFixed(2)}
                  </span>
                )}
              </div>

              {/* Selection Area */}
              <div className="col-span-1 md:col-span-7">
                {step.products.length > 0 ? (
                  // FILLED STATE
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
                            {/* via {step.product.merchant || "Unknown"}{" "} */}
                            via {"Unknown"} <ExternalLink size={10} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <></> // Empty state shows nothing
                )}
              </div>

              {/* Merchant Column (Desktop Only) */}
              <div className="hidden md:flex col-span-2 items-center">
                {step.products.length > 0 && (
                  <div className="flex flex-col gap-8">
                    {step.products.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex items-center gap-2 p-3 bg-white border border-zinc-200 rounded text-xs font-bold text-zinc-700 shadow-sm"
                      >
                        {/* {prod.merchantLogo && prod.merchantLogo !== "/placeholder-logo.png" ? (
                           <Image 
                             src={prod.merchantLogo || ""}
                             alt="Merchant"
                             width={20}
                             height={20}
                             className="object-cover"
                           />
                        ) : ( */}
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[10px] text-blue-700">
                          -
                        </div>
                        {/* )} */}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Column (Desktop Only) */}
              <div className="hidden md:block col-span-1 text-right">
                {step.products.length > 0 ? (
                  <div className="flex flex-col items-end gap-13">
                    {step.products.map((p) => (
                      <div
                        key={p.id}
                        className="text-lg font-bold text-zinc-900"
                      >
                        ${(p.price || 0).toFixed(2)}
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
          <div
            className={`
          bottom-0 left-0 w-full bg-white border border-zinc-200 shadow-md rounded-lg mt-4 z-40 px-6 py-4
          lg:top-20 lg:bottom-auto lg:shadow-sm 
          `}
          >
            <div>
              <div className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
                Estimated Total
              </div>
              <div className="text-2xl font-extrabold text-black">
                CA ${totalPrice.toFixed(2)}
              </div>
              <span className="hidden sm:flex items-center text-sm font-medium text-zinc-500 mr-2">
                {totalItems} items selected
              </span>
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
              {notes.morning.length > 0 ? (
                <ol className="relative border-l border-zinc-200 ml-3 space-y-6">
                  {notes.morning.map((note, index) => (
                    <li key={index} className="ml-6">
                      <span className="absolute -left-1.5 w-3 h-3 bg-zinc-200 rounded-full mt-1.5 ring-4 ring-white" />
                      <h4 className="font-bold text-zinc-900 text-sm">
                        {note.title}
                      </h4>
                      <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                        {note.description}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-zinc-400 italic ml-4">
                  No morning notes added.
                </p>
              )}
            </div>

            {/* Evening Notes */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-violet-500 font-bold uppercase text-xs tracking-wider">
                <div className="w-2 h-2 rounded-full bg-violet-500" /> Night
              </div>
              {notes.evening.length > 0 ? (
                <ol className="relative border-l border-zinc-200 ml-3 space-y-6">
                  {notes.evening.map((note, index) => (
                    <li key={index} className="ml-6">
                      <span className="absolute -left-1.5 w-3 h-3 bg-zinc-200 rounded-full mt-1.5 ring-4 ring-white" />
                      <h4 className="font-bold text-zinc-900 text-sm">
                        {note.title}
                      </h4>
                      <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                        {note.description}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-zinc-400 italic ml-4">
                  No evening notes added.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
