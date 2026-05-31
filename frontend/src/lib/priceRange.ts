export function parseMinSliderValue(raw: string, max: number): number {
  const n = parseFloat(raw);
  if (!raw.trim() || !Number.isFinite(n) || n <= 0) {
    return 0;
  }
  return Math.min(Math.max(0, n), max);
}

export function parseMaxSliderValue(raw: string, max: number): number {
  const n = parseFloat(raw);
  if (!raw.trim() || !Number.isFinite(n) || n < 0) {
    return max;
  }
  return Math.min(n, max);
}

export function toPriceRange(
  min: string,
  max: string,
  sliderMax: number,
): [number, number] {
  const lo = parseMinSliderValue(min, sliderMax);
  const hi = parseMaxSliderValue(max, sliderMax);
  return [Math.min(lo, hi), Math.max(lo, hi)];
}

export function formatPriceRangeLabel(
  [min, max]: [number, number],
  sliderMax: number,
  currencyPrefix = "CA $", // For more than canada, must update this
): string {
  const minLabel = min <= 0 ? `${currencyPrefix}0` : `${currencyPrefix}${min}`;
  const maxLabel =
    max >= sliderMax ? `${currencyPrefix}${sliderMax}+` : `${currencyPrefix}${max}`;
  return `${minLabel} – ${maxLabel}`;
}
