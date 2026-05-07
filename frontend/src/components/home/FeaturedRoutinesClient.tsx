"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { SkinType } from "@/types/product";
import { skinTypeLabel } from "@/lib/routineSkinTypeTags";

export type FeaturedRoutineCard = {
  routineId: number;
  name: string;
  authorLabel: string;
  blurb?: string;
  skinTypeTags: SkinType[];
  previewImageUrls: string[];
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
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-white to-transparent md:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-white to-transparent md:block" />

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
          <article
            key={routine.routineId}
            className="w-[min(100%,320px)] shrink-0 snap-start sm:w-[min(100%,340px)] md:w-[calc((100%-2rem)/3)]"
          >
            <Link
              href={`/routine/${routine.routineId}`}
              className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-zinc-900 leading-snug line-clamp-2">
                    {routine.name}
                  </h3>
                  {routine.authorLabel && (
                    <p className="mt-1 text-xs text-zinc-500">
                      by {routine.authorLabel}
                    </p>
                  )}
                </div>
                <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                  Featured
                </span>
              </div>
              {routine.previewImageUrls.length > 0 && (
                <div className="mb-3 flex gap-1.5">
                  {routine.previewImageUrls.slice(0, 4).map((url, i) => (
                    <div
                      key={`${routine.routineId}-${i}-${url.slice(-24)}`}
                      className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-zinc-100 bg-zinc-50"
                    >
                      <img
                        src={url}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              {routine.skinTypeTags.length > 0 && (
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
              )}
              {/* {routine.blurb && (
                <p className="text-sm text-zinc-600 line-clamp-3">{routine.blurb}</p>
              )} */}
              <span className="mt-auto pt-4 text-sm font-medium text-blue-700">
                View guide →
              </span>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
