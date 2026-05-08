"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SkinType } from "@/types/product";
import RoutineSkinTypeTagPicker from "@/components/routine/RoutineSkinTypeTagPicker";
import { Button } from "@/components/ui/button";

export default function GuidesFilters({
  initialTags,
  initialMaxPrice,
}: {
  initialTags: SkinType[];
  initialMaxPrice: string;
}) {
  const router = useRouter();
  const [tags, setTags] = useState<SkinType[]>(initialTags);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  useEffect(() => {
    setTags(initialTags);
    setMaxPrice(initialMaxPrice);
  }, [initialTags, initialMaxPrice]);

  const toggle = (t: SkinType) => {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  const apply = () => {
    const p = new URLSearchParams();
    if (tags.length > 0) {
      p.set("tags", tags.join(","));
    }
    if (maxPrice.trim()) {
      p.set("maxPrice", maxPrice.trim());
    }
    const qs = p.toString();
    router.push(qs ? `/guides?${qs}` : "/guides");
  };

  const clear = () => {
    setTags([]);
    setMaxPrice("");
    router.push("/guides");
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-zinc-900">
        Filter guides
      </div>
      <p className="mb-4 text-xs text-zinc-500">
        Tags match routine skin types. Max price is the total of products in the
        routine (catalog prices, CAD).
      </p>
      <div className="mb-4">
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
          Matches any selected tag
        </div>
        <RoutineSkinTypeTagPicker value={tags} onToggle={toggle} />
      </div>
      <div className="mb-4">
        <label
          htmlFor="guides-max-price"
          className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-500"
        >
          Max routine total
        </label>
        <input
          id="guides-max-price"
          type="number"
          min={0}
          step={1}
          inputMode="decimal"
          placeholder="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full max-w-xs rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
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
