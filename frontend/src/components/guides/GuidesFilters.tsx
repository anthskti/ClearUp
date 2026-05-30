"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SkinType } from "@/types/product";
import RoutineSkinTypeTagPicker from "@/components/routine/RoutineSkinTypeTagPicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

// Slider ceiling (CAD). Max at this value = no upper bound filter (`300+`). Min at 0 = no lower bound.
export const GUIDES_PRICE_SLIDER_MAX = 300;

function parseMinSliderValue(raw: string): number {
  const n = parseFloat(raw);
  if (!raw.trim() || !Number.isFinite(n) || n <= 0) {
    return 0;
  }
  return Math.min(Math.max(0, n), GUIDES_PRICE_SLIDER_MAX);
}

function parseMaxSliderValue(raw: string): number {
  const n = parseFloat(raw);
  if (!raw.trim() || !Number.isFinite(n) || n < 0) {
    return GUIDES_PRICE_SLIDER_MAX;
  }
  return Math.min(n, GUIDES_PRICE_SLIDER_MAX);
}

function formatPriceRangeLabel([min, max]: [number, number]): string {
  const minLabel = min <= 0 ? "CA $0" : `CA $${min}`;
  const maxLabel =
    max >= GUIDES_PRICE_SLIDER_MAX ? "CA $300+" : `CA $${max}`;
  return `${minLabel} – ${maxLabel}`;
}

function toPriceRange(min: string, max: string): [number, number] {
  const lo = parseMinSliderValue(min);
  const hi = parseMaxSliderValue(max);
  return [Math.min(lo, hi), Math.max(lo, hi)];
}

export default function GuidesFilters({
  initialTags,
  initialMinPrice,
  initialMaxPrice,
}: {
  initialTags: SkinType[];
  initialMinPrice: string;
  initialMaxPrice: string;
}) {
  const router = useRouter();
  const [tags, setTags] = useState<SkinType[]>(initialTags);
  const [priceRange, setPriceRange] = useState<[number, number]>(() =>
    toPriceRange(initialMinPrice, initialMaxPrice),
  );

  useEffect(() => {
    setTags(initialTags);
    setPriceRange(toPriceRange(initialMinPrice, initialMaxPrice));
  }, [initialTags, initialMinPrice, initialMaxPrice]);

  const toggle = (t: SkinType) => {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  const apply = () => {
    const [minPrice, maxPrice] = priceRange;
    const p = new URLSearchParams();
    if (tags.length > 0) {
      p.set("tags", tags.join(","));
    }
    if (minPrice > 0) {
      p.set("minPrice", String(minPrice));
    }
    if (maxPrice < GUIDES_PRICE_SLIDER_MAX) {
      p.set("maxPrice", String(maxPrice));
    }
    const qs = p.toString();
    router.push(qs ? `/guides?${qs}` : "/guides");
  };

  const clear = () => {
    setTags([]);
    setPriceRange([0, GUIDES_PRICE_SLIDER_MAX]);
    router.push("/guides");
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-zinc-900">
        Filter guides
      </div>
      <p className="mb-4 text-xs text-zinc-500">
        Tags match routine skin types. Price range uses the sum of catalog prices
        in each routine (CAD).
      </p>
      <div className="mb-4">
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
          Matches any selected tag
        </div>
        <RoutineSkinTypeTagPicker value={tags} onToggle={toggle} />
      </div>

      <div className="mb-4 max-w-md">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
          Routine Total
        </h2>
        <p className="mb-3 text-sm font-semibold text-zinc-800">
          {formatPriceRangeLabel(priceRange)}
        </p>
        <Slider
          value={priceRange}
          onValueChange={(value) =>
            setPriceRange(value as [number, number])
          }
          min={0}
          max={GUIDES_PRICE_SLIDER_MAX}
          step={5}
          className="mb-3"
        />
        <div className="flex items-center justify-between gap-4 text-sm">
          <div className="flex flex-col items-start">
            <label
              htmlFor="guides-price-from"
              className="mb-1 text-xs font-medium text-zinc-600"
            >
              From
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-2 -translate-y-1/2 text-sm text-zinc-400">
                $
              </span>
              <Input
                id="guides-price-from"
                type="text"
                inputMode="numeric"
                value={priceRange[0]}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  const next = raw === "" ? 0 : Number(raw);
                  const clamped = Math.min(
                    Math.max(0, next),
                    GUIDES_PRICE_SLIDER_MAX,
                  );
                  setPriceRange([
                    Math.min(clamped, priceRange[1]),
                    priceRange[1],
                  ]);
                }}
                className="mt-0 w-24 pl-6"
              />
            </div>
          </div>
          <div className="flex flex-col items-start">
            <label
              htmlFor="guides-price-to"
              className="mb-1 text-xs font-medium text-zinc-600"
            >
              To
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-2 -translate-y-1/2 text-sm text-zinc-400">
                $
              </span>
              <Input
                id="guides-price-to"
                type="text"
                inputMode="numeric"
                value={
                  priceRange[1] >= GUIDES_PRICE_SLIDER_MAX
                    ? `${GUIDES_PRICE_SLIDER_MAX}+`
                    : priceRange[1]
                }
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  const next =
                    raw === "" ? GUIDES_PRICE_SLIDER_MAX : Number(raw);
                  const clamped = Math.min(
                    Math.max(0, next),
                    GUIDES_PRICE_SLIDER_MAX,
                  );
                  setPriceRange([
                    priceRange[0],
                    Math.max(clamped, priceRange[0]),
                  ]);
                }}
                className="mt-0 w-24 pl-6"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={apply}>
          Apply filters
        </Button>
        <Button type="button" variant="outline" onClick={clear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
