"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SkinType } from "@/types/product";
import RoutineSkinTypeTagPicker from "@/components/routine/RoutineSkinTypeTagPicker";
import { Button } from "@/components/ui/button";
import PriceRangeFilter from "@/components/filters/PriceRangeFilter";
import { toPriceRange } from "@/lib/priceRange";

/** Slider ceiling (CAD). Max at this value = no upper bound filter (`300+`). Min at 0 = no lower bound. */
export const GUIDES_PRICE_SLIDER_MAX = 300;

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
    toPriceRange(initialMinPrice, initialMaxPrice, GUIDES_PRICE_SLIDER_MAX),
  );

  useEffect(() => {
    setTags(initialTags);
    setPriceRange(
      toPriceRange(initialMinPrice, initialMaxPrice, GUIDES_PRICE_SLIDER_MAX),
    );
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

      <div className="mb-4">
        <PriceRangeFilter
          idPrefix="guides-price"
          title="Routine total"
          value={priceRange}
          onChange={setPriceRange}
          sliderMax={GUIDES_PRICE_SLIDER_MAX}
          step={5}
        />
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
