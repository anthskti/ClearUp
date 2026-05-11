"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { SkinType } from "@/types/product";
import type { RoutineWithProducts } from "@/types/routine";
import { skinTypeLabel } from "@/lib/routineSkinTypeTags";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function previewUrlsFromRoutineProducts(
  routine: RoutineWithProducts,
  max = 4,
): string[] {
  const out: string[] = [];
  for (const rp of routine.products ?? []) {
    const url = rp.product?.imageUrls?.[0];
    if (url) {
      out.push(url);
      if (out.length >= max) break;
    }
  }
  return out;
}

export function estimatedPriceFromRoutineProducts(
  routine: RoutineWithProducts,
): number {
  return (routine.products ?? []).reduce(
    (sum, rp) => sum + (rp.product?.price ?? 0),
    0,
  );
}

const cardShell =
  "flex h-full flex-col rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:border-zinc-300 hover:shadow-md";

export type RoutinePreviewCardProps = {
  routineId: number;
  name: string;
  authorLabel?: string;
  skinTypeTags: SkinType[];
  previewImageUrls: string[];
  estimatedTotalPrice?: number;
  showFeaturedStar?: boolean;
  buttonLabel?: string;
  className?: string;
};

export default function RoutinePreviewCard({
  routineId,
  name,
  authorLabel,
  skinTypeTags,
  previewImageUrls,
  estimatedTotalPrice,
  showFeaturedStar = false,
  buttonLabel = "View Routine",
  className,
}: RoutinePreviewCardProps) {
  const href = `/routine/${routineId}`;
  const showPrice =
    estimatedTotalPrice !== undefined && estimatedTotalPrice !== null;

  return (
    <article className={cn("group/card h-full", className)}>
      <div className={cn(cardShell, "overflow-hidden")}>
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="line-clamp-2 font-bold leading-snug text-zinc-900 transition-colors group-hover/card:text-blue-600">
                {name}
              </h3>
              {authorLabel?.trim() && (
                <p className="mt-1 text-xs text-zinc-500">
                  by {authorLabel.trim()}
                </p>
              )}
            </div>
            {(showFeaturedStar || showPrice) && (
              <div className="flex shrink-0 items-center gap-2">
                {showFeaturedStar && (
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-amber-300 bg-amber-50/90 shadow-sm"
                    aria-hidden
                  >
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                  </span>
                )}
                {showPrice && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-900">
                    Est. ${estimatedTotalPrice.toFixed(0)}
                  </span>
                )}
              </div>
            )}
          </div>
          {previewImageUrls.length > 0 && (
            <div className="mb-3 flex gap-1.5">
              {previewImageUrls.slice(0, 4).map((url, i) => (
                <div
                  key={`${routineId}-${i}-${url.slice(-24)}`}
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
          {skinTypeTags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {skinTypeTags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700"
                >
                  {skinTypeLabel(t)}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="mt-auto border-t border-zinc-100 bg-zinc-50/50 px-5 py-4">
          <Link href={href} className="block w-full">
            <Button
              variant="outline"
              className="group/btn w-full transition-colors group-hover/card:bg-zinc-50"
            >
              {buttonLabel}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
