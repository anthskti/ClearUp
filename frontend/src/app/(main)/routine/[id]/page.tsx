import Link from "next/link";
import Image from "next/image";
import { Book, ExternalLink } from "lucide-react";
import ProceduralWave from "@/components/themes/ProceduralWave";
import { getRoutineWithProducts } from "@/lib/routines";

import DeleteRoutineButton from "@/components/routine/DeleteRoutineButton";
import RoutineDescriptionEditor from "@/components/routine/RoutineDescriptionEditor";
import RoutineShareLink from "@/components/routine/RoutineShareLink";
import { getEffectiveUser, getSession } from "@/lib/auth";
import { headers } from "next/headers";

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

  const headersList = await headers();
  const cookieString = headersList.get("cookie") || "";
  let session = null;
  let effectiveUser = null;

  try {
    session = await getSession(cookieString);
    effectiveUser = await getEffectiveUser(cookieString);
  } catch (error) {
    console.error("Session fetch failed:", error);
  }

  if (!routineData) {
    return <div>Routine not found</div>;
  }

  const canEditRoutine =
    session?.user?.id === routineData.userId || effectiveUser?.role === "admin";

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
    0,
  );
  const totalItems = finalRoutine.reduce(
    (acc, step) => acc + step.products.length,
    0,
  );
  const authorName = routineData.author?.name || "ClearUp User";

  return (
    <div className="relative min-h-screen w-full bg-[#F8F8F8]">
      <ProceduralWave seed={123} height={190} />
      <div className="relative z-1 max-w-6xl mx-auto px-6 pt-20 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2E2E2E] uppercase">
            {routineData.name}
            {authorName !== "ClearUp User" && (
              <div className="text-lg text-zinc-500">
                Viewing Routine by{" "}
                <span className="underline">{authorName}</span>
              </div>
            )}
          </h1>

          <RoutineShareLink routineId={id} />
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
          bottom-0 left-0 w-full bg-white border border-zinc-200 shadow-md rounded-lg mt-4 z-20 px-6 py-4
          lg:top-20 lg:bottom-auto lg:shadow-sm 
          `}
        >
          <div
            className={`
          bottom-0 left-0 w-full bg-white border border-zinc-200 shadow-md rounded-lg mt-4 z-20 px-6 py-4
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

        <RoutineDescriptionEditor
          routineId={routineData.id}
          initialDescription={routineData.description}
          canEdit={canEditRoutine}
        />
        {/* Delete if user is signed in */}
        {canEditRoutine && <DeleteRoutineButton routineId={routineData.id} />}
      </div>
    </div>
  );
}
