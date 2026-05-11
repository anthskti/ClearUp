"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import {
  Plus,
  ArrowRight,
  Loader2,
  Sparkles,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { skinTypeLabel } from "@/lib/routineSkinTypeTags";
import { getMyRoutines } from "@/lib/routines";
import type {
  RoutineProductWithDetails,
  RoutineWithProducts,
} from "@/types/routine";
import RoutinePreviewCard, {
  estimatedPriceFromRoutineProducts,
  previewUrlsFromRoutineProducts,
} from "@/components/guides/RoutinePreviewCard";

export default function CreatedRoutinesPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [routines, setRoutines] = useState<RoutineWithProducts[]>([]);
  const [isLoadingRoutines, setIsLoadingRoutines] = useState(true);
  const [isListView, setIsListView] = useState(false);

  useEffect(() => {
    const fetchRoutines = async () => {
      if (session?.user?.id) {
        try {
          const data = await getMyRoutines();
          const reversedData = data ? [...data].reverse() : [];
          setRoutines(reversedData);
        } catch (error) {
          console.error("Failed to fetch routines:", error);
        } finally {
          setIsLoadingRoutines(false);
        }
      }
    };

    if (!isPending) {
      fetchRoutines();
    }
  }, [session, isPending]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl pt-24 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-2">
        <div>
          <h1 className="text-2xl font-bold mb-1">Created Routines</h1>
          <p className="text-zinc-500 text-sm">
            View all your skincare routines you have built.
          </p>
        </div>
        <Link href="/builder">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Routine
          </Button>
        </Link>
      </div>
      <div className="flex items-center gap-3 py-3">
        {/* List + Grid Layout method */}
        <div className="hidden md:flex items-center bg-zinc-100 p-1 rounded-lg">
          <button
            onClick={() => setIsListView(false)}
            className={`p-2 rounded-md transition-all ${!isListView ? "bg-white shadow-sm text-blue-600" : "text-zinc-500 hover:text-zinc-900"}`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsListView(true)}
            className={`p-2 rounded-md transition-all ${isListView ? "bg-white shadow-sm text-blue-600" : "text-zinc-500 hover:text-zinc-900"}`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Loading State for Data */}
      {isLoadingRoutines ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      ) : routines.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-zinc-50 rounded-2xl border border-zinc-100 border-dashed">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <Sparkles className="w-8 h-8 text-zinc-300" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No routines yet</h3>
          <p className="text-zinc-500 max-w-md mb-6">
            You haven't created any skincare routines. Head over to the builder
            to create your first personalized routine.
          </p>
          <Link href="/builder">
            <Button>Go to Builder</Button>
          </Link>
        </div>
      ) : (
        // Routines Grid/List
        <div
          className={
            isListView
              ? "flex flex-col gap-4"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          }
        >
          {routines.map((routine) =>
            isListView ? (
              // Routines Row List
              <div
                key={routine.id}
                className="group bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-200 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Routine Info */}
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors line-clamp-1">
                      {routine.name}
                    </h3>
                    <span className="text-xs font-medium bg-zinc-100 text-zinc-600 px-2 py-1 rounded-full">
                      {routine.products?.length || 0} items
                    </span>
                  </div>

                  <div>
                    {routine.skinTypeTags.length > 0 ? (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {routine.skinTypeTags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700"
                          >
                            {skinTypeLabel(t)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <span className="px-2 py-0.5"></span>
                      </div>
                    )}
                  </div>

                  {/* Product Image Thumbnails */}
                  {routine.products && routine.products.length > 0 && (
                    <div className="flex items-center">
                      {routine.products
                        .slice(0, 6)
                        .map((rp: RoutineProductWithDetails, idx: number) => (
                          <div
                            key={idx}
                            className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-zinc-50 shrink-0 -ml-2 first:ml-0 shadow-sm relative group/tooltip"
                            title={rp.product?.name || rp.category}
                          >
                            {rp.product?.imageUrls?.[0] ? (
                              <img
                                src={rp.product.imageUrls[0]}
                                alt="product preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-400 bg-zinc-100 uppercase">
                                {rp.category.substring(0, 2)}
                              </div>
                            )}
                          </div>
                        ))}

                      {/* If there are more than 6 products, show a "+X" bubble */}
                      {routine.products.length > 6 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600 shrink-0 -ml-2 shadow-sm z-10">
                          +{routine.products.length - 6}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* View Routine Action */}
                <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0 border-t border-zinc-100 md:border-none pt-4 md:pt-0">
                  <Link
                    href={`/routine/${routine.id}`}
                    className="w-full block"
                  >
                    <Button
                      variant="outline"
                      className="group/btn w-full transition-colors md:w-auto group-hover:bg-zinc-50"
                    >
                      View Routine
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <RoutinePreviewCard
                key={routine.id}
                routineId={routine.id}
                name={routine.name}
                authorLabel={routine.author?.name?.trim()}
                skinTypeTags={routine.skinTypeTags ?? []}
                previewImageUrls={previewUrlsFromRoutineProducts(routine)}
                estimatedTotalPrice={estimatedPriceFromRoutineProducts(routine)}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
