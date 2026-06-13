"use client";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { Copy, Plus, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProceduralWave from "@/components/themes/ProceduralWave";
import ProductImage from "@/components/ui/ProductImage";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useBuilderRoutine } from "@/hooks/useBuilderRoutine";
import { useBuilderProductNotes } from "@/hooks/useBuilderProductNotes";
import {
  assertRoutineSaveItemsValid,
  buildRoutineSaveItems,
} from "@/lib/buildRoutineSaveItems";
import type { SkinType } from "@/types/product";
import RoutineSkinTypeTagPicker from "@/components/routine/RoutineSkinTypeTagPicker";
import BuilderSkeleton from "@/components/routine/BuilderSkeleton";
import BuilderProductNotesSection from "@/components/routine/BuilderProductNotesSection";
import SaveRoutineModal from "@/components/routine/SaveRoutineModal";
import { createRoutine } from "@/lib/routines";
import type { ProductCategory } from "@/types/product";

function AddCategoryProductLink({
  categoryId,
  label,
  className = "",
}: {
  categoryId: ProductCategory;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={`/products/category/${categoryId}`}
      className={`inline-flex items-center gap-1.5 pl-16 md:pl-20 text-sm text-zinc-500 hover:text-zinc-800 transition-colors ${className}`}
    >
      <Plus size={14} strokeWidth={2.5} aria-hidden />
      <span className="font-medium capitalize">Select {label}</span>
    </Link>
  );
}

export default function Builder() {
  const {
    routine,
    isLoaded: routineLoaded,
    removeProductFromSlot,
    clearRoutine,
  } = useBuilderRoutine();
  const {
    entries: noteEntries,
    isLoaded: notesLoaded,
    morningNotes,
    eveningNotes,
    addProductNote,
    updateProductNote,
    removeProductNote,
    removeNotesForProduct,
    clearProductNotes,
  } = useBuilderProductNotes();

  const routineProductOptions = useMemo(
    () =>
      routine.flatMap((slot) =>
        slot.products.map((product) => ({
          product,
          category: slot.id,
        })),
      ),
    [routine],
  );

  const modalProducts = useMemo(() => {
    const seen = new Set<number>();
    return routineProductOptions
      .filter(({ product }) => {
        if (seen.has(product.id)) return false;
        seen.add(product.id);
        return true;
      })
      .map(({ product, category }) => ({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        category,
      }));
  }, [routineProductOptions]);

  const saveItems = useMemo(
    () => buildRoutineSaveItems(routine, noteEntries),
    [routine, noteEntries],
  );

  const handleAddProductNote = useCallback(
    (
      productId: number,
      category: (typeof routineProductOptions)[0]["category"],
      timeOfDay: "AM" | "PM",
      userNote: string,
    ) => {
      const match = routineProductOptions.find(
        (o) => o.product.id === productId,
      );
      if (!match) return;
      addProductNote(match.product, category, timeOfDay, userNote);
    },
    [routineProductOptions, addProductNote],
  );

  const handleRemoveProduct = useCallback(
    (category: (typeof routine)[0]["id"], productId: number) => {
      removeProductFromSlot(category, productId);
      removeNotesForProduct(productId);
    },
    [removeProductFromSlot, removeNotesForProduct],
  );

  const [skinTypeTags, setSkinTypeTags] = useState<SkinType[]>([]);
  const { data: session } = authClient.useSession(); // session data
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, startSaveTransition] = useTransition(); // lowers priority update so UI is responsive (laggy since so much is being pushed.)

  const handleCloseSaveModal = useCallback(() => setIsModalOpen(false), []);

  const handleSaveRoutine = useCallback(
    async ({
      name,
      description,
      skinTypeTags: tags,
    }: {
      name: string;
      description: string;
      skinTypeTags: SkinType[];
    }) => {
      const items = buildRoutineSaveItems(routine, noteEntries);
      assertRoutineSaveItemsValid(items);
      const response = await createRoutine({
        name,
        description,
        skinTypeTags: tags,
        items,
      });
      clearRoutine();
      clearProductNotes();
      setSkinTypeTags([]);
      return response.id;
    },
    [routine, noteEntries, clearRoutine, clearProductNotes],
  );

  const toggleSkinTypeTag = (tag: SkinType) => {
    setSkinTypeTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleInitialSave = () => {
    if (!session) {
      alert("Please log in to save your routine."); // Update with Toaster
      router.push("/login");
      return;
    }
    try {
      assertRoutineSaveItemsValid(saveItems);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Cannot save an empty routine.");
      return;
    }
    startSaveTransition(() => setIsModalOpen(true));
  };

  const totalPrice = routine.reduce(
    (acc, step) => acc + step.products.reduce((s, p) => s + (p.price || 0), 0),
    0,
  );
  const totalItems = routine.reduce(
    (acc, step) => acc + step.products.length,
    0,
  );

  // Don't render until hooks are loaded
  if (!routineLoaded || !notesLoaded) {
    return <BuilderSkeleton />;
  }

  return (
    <div className="relative min-h-screen w-full bg-[#F8F8F8]">
      <ProceduralWave seed={3} height={190} />
      <div className="relative z-1 max-w-6xl mx-auto px-6 pt-26 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2E2E2E] uppercase">
            Build Your Routine
          </h1>

          {/* External Link; removed */}
          {/* <div className="flex items-center bg-white border border-zinc-200 rounded-md overflow-hidden shadow-sm max-w-lg w-full md:w-auto">
            <div className="bg-zinc-50 px-3 py-2 border-r border-zinc-200 text-zinc-400">
              <ExternalLink size={16} />
            </div>
            <input
              readOnly
              value={typeof window !== "undefined" ? window.location.href : ""}
              className="px-3 py-2 text-sm text-zinc-600 outline-none w-full md:w-64 bg-transparent"
            />
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="px-4 py-2 hover:bg-zinc-50 border-l border-zinc-200 transition-colors"
            >
              <Copy size={16} className="text-zinc-500 hover:text-black" />
            </button>
          </div> */}
        </div>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-12 gap-4 text-zinc-500 font-bold uppercase text-xs border-b border-zinc-200 px-2 pb-2 mb-2">
          <div className="col-span-2">Category</div>
          <div className="col-span-7">Product Selection</div>
          <div className="col-span-1 text-center">Seller</div>
          <div className="col-span-2 text-right">Price</div>
        </div>

        {/* Builder */}
        <div className="space-y-4 md:space-y-0">
          {routine.map((step) => (
            <div
              key={step.id}
              className={`
              group bg-white rounded-xl border border-zinc-200 shadow-sm p-4 grid grid-cols-1 gap-4 transition-all hover:bg-zinc-50/50
              md:bg-transparent md:rounded-none md:border-0 md:border-b md:border-zinc-200 md:shadow-none md:px-2 md:py-5 md:grid-cols-12 md:gap-y-4 md:items-center
              `}
            >
              {/* Category Label */}
              <div
                className="col-span-1 md:col-span-2 flex justify-between md:block md:self-start"
                style={
                  step.products.length > 0
                    ? { gridRow: `span ${step.products.length}` }
                    : undefined
                }
              >
                <Link href={`/products/category/${step.id}`}>
                  <span className="font-bold text-zinc-900 uppercase text-sm md:text-xs tracking-wide hover:text-zinc-500 transition-colors">
                    {step.label}
                  </span>
                </Link>
                {/* Mobile Price Display */}
                {step.products.length > 0 && (
                  <span className="md:hidden font-bold text-zinc-900">
                    $
                    {step.products
                      .reduce((s, p) => s + (p.price || 0), 0)
                      .toFixed(2)}
                  </span>
                )}
              </div>

              {step.products.length > 0 ? (
                <>
                  {step.products.map((prod, productIndex) => (
                    <div
                      key={`${step.id}-${prod.id}-${productIndex}`}
                      className="col-span-1 md:contents"
                    >
                      <div className="flex items-center gap-4 md:col-span-7 md:col-start-3">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-100 rounded-md border border-zinc-200 shrink-0 overflow-hidden">
                          {prod.imageUrls && prod.imageUrls[0] ? (
                            <ProductImage
                              src={prod.imageUrls[0]}
                              alt={prod.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                              sizes="64px"
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
                          <div className="md:hidden text-xs text-zinc-500 mt-1 flex items-center gap-1">
                            via {prod.merchant || "Unknown"}{" "}
                            <ExternalLink size={10} />
                          </div>
                        </div>

                        <div className="shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveProduct(step.id, prod.id)
                            }
                            className="top-2 right-2 group-hover:block p-2 text-zinc-300 hover:text-red-500 transition-colors md:relative md:top-auto md:right-auto"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="hidden md:flex md:col-span-1 items-center justify-center">
                        <div className="flex items-center gap-2 p-3 bg-white border border-zinc-200 rounded text-xs font-bold text-zinc-700 shadow-sm">
                          {prod.merchantLogo &&
                          prod.merchantLogo.startsWith("http") ? (
                            <ProductImage
                              src={prod.merchantLogo}
                              alt={prod.merchant || "Merchant"}
                              width={20}
                              height={20}
                              className="object-cover rounded-sm"
                              sizes="20px"
                            />
                          ) : (
                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[10px] text-blue-700">
                              ?
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="hidden md:block md:col-span-2 text-right text-lg font-bold text-zinc-900">
                        ${(prod.price || 0).toFixed(2)}
                      </div>
                    </div>
                  ))}

                  <div className="col-span-1 md:col-span-7 md:col-start-3">
                    <AddCategoryProductLink
                      categoryId={step.id}
                      label={step.label}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-1 md:col-span-7">
                    <Link href={`/products/category/${step.id}`}>
                      <div className="w-full h-14 md:h-16 border-2 border-dashed border-zinc-300 rounded-lg flex items-center justify-center gap-2 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-all cursor-pointer">
                        <Plus size={18} />
                        <span className="font-medium text-sm">
                          Select {step.label}
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="hidden md:block md:col-span-1" />
                  <div className="hidden md:block md:col-span-2 text-right">
                    <span className="text-zinc-200 font-medium">---</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <BuilderProductNotesSection
          modalProducts={modalProducts}
          morningNotes={morningNotes}
          eveningNotes={eveningNotes}
          onAddNote={handleAddProductNote}
          onUpdateNote={updateProductNote}
          onRemoveNote={removeProductNote}
        />
        <div
          className={`
          bottom-0 left-0 w-full bg-white border border-zinc-200 shadow-md rounded-lg mt-8 z-20 px-6 py-4
          lg:top-20 lg:bottom-auto lg:shadow-sm 
          `}
        >
          <div className="mb-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
              Skin Type for this Routine
            </div>
            <RoutineSkinTypeTagPicker
              value={skinTypeTags}
              onToggle={toggleSkinTypeTag}
            />
          </div>
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
                onClick={handleInitialSave}
                disabled={totalItems === 0}
              >
                Save
              </Button>
              {isModalOpen && (
                <SaveRoutineModal
                  isOpen
                  onClose={handleCloseSaveModal}
                  skinTypeTags={skinTypeTags}
                  onSave={handleSaveRoutine}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
