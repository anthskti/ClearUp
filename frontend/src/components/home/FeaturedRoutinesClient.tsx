"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SkinType } from "@/types/product";
import RoutinePreviewCard from "@/components/guides/RoutinePreviewCard";

export type FeaturedRoutineCard = {
  routineId: number;
  name: string;
  authorLabel: string;
  skinTypeTags: SkinType[];
  previewImageUrls: string[];
  estimatedTotalPrice: number;
};

export default function FeaturedRoutinesClient({
  items,
}: {
  items: FeaturedRoutineCard[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.round(el.clientWidth * 0.85);
    el.scrollBy({ left: dir === "left" ? -delta : delta, behavior: "smooth" });
  };

  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-6 py-12 text-center text-sm text-zinc-500">
        No featured guides yet. Check back soon.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 md:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 md:block" />

      <div className="mb-4 flex justify-end gap-2 md:absolute md:right-0 md:top-[-3rem]">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50"
          aria-label="Previous guides"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:bg-zinc-50"
          aria-label="Next guides"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((routine) => (
          <RoutinePreviewCard
            key={routine.routineId}
            className="w-[min(100%,320px)] shrink-0 snap-start sm:w-[min(100%,340px)] md:w-[calc((100%-2rem)/3)]"
            routineId={routine.routineId}
            name={routine.name}
            authorLabel={routine.authorLabel}
            skinTypeTags={routine.skinTypeTags}
            previewImageUrls={routine.previewImageUrls}
            estimatedTotalPrice={routine.estimatedTotalPrice}
            showFeaturedStar
          />
        ))}
      </div>
    </div>
  );
}
