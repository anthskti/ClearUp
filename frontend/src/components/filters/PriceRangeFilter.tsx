"use client";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { formatPriceRangeLabel } from "@/lib/priceRange";

interface PriceRangeFilterProps {
  idPrefix: string;
  title: string;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  sliderMax: number;
  step?: number;
  size?: "default" | "compact";  // compact: fits narrow sidebars; default; matches regular filter card.
}

export default function PriceRangeFilter({
  idPrefix,
  title,
  value,
  onChange,
  sliderMax,
  step = 1,
  size = "default",
}: PriceRangeFilterProps) {
  const isCompact = size === "compact";

  return (
    <div className={isCompact ? "w-full" : "max-w-md"}>
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
        {title}
      </h2>
      <p className="mb-3 text-sm font-semibold text-zinc-800">
        {formatPriceRangeLabel(value, sliderMax)}
      </p>
      <Slider
        value={value}
        onValueChange={(next) => onChange(next as [number, number])}
        min={0}
        max={sliderMax}
        step={step}
        className="mb-3"
      />
      <div
        className={
          isCompact
            ? "grid grid-cols-2 gap-2 text-sm"
            : "flex items-center justify-between gap-4 text-sm"
        }
      >
        <div className={isCompact ? "min-w-0" : "flex flex-col items-start"}>
          <label
            htmlFor={`${idPrefix}-from`}
            className="mb-1 text-xs font-medium text-zinc-600"
          >
            From
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-2 -translate-y-1/2 text-sm text-zinc-400">
              $
            </span>
            <Input
              id={`${idPrefix}-from`}
              type="text"
              inputMode="numeric"
              value={value[0]}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                const next = raw === "" ? 0 : Number(raw);
                const clamped = Math.min(Math.max(0, next), sliderMax);
                onChange([Math.min(clamped, value[1]), value[1]]);
              }}
              className={isCompact ? "mt-0 w-full min-w-0 pl-6" : "mt-0 w-24 pl-6"}
            />
          </div>
        </div>
        <div className={isCompact ? "min-w-0" : "flex flex-col items-start"}>
          <label
            htmlFor={`${idPrefix}-to`}
            className="mb-1 text-xs font-medium text-zinc-600"
          >
            To
          </label>
          <div className="relative">
            <span className="absolute top-1/2 left-2 -translate-y-1/2 text-sm text-zinc-400">
              $
            </span>
            <Input
              id={`${idPrefix}-to`}
              type="text"
              inputMode="numeric"
              value={
                value[1] >= sliderMax ? `${sliderMax}+` : value[1]
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                const next = raw === "" ? sliderMax : Number(raw);
                const clamped = Math.min(Math.max(0, next), sliderMax);
                onChange([value[0], Math.max(clamped, value[0])]);
              }}
              className={isCompact ? "mt-0 w-full min-w-0 pl-6" : "mt-0 w-24 pl-6"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
