import type { SkinType } from "@/types/product";

// Matches backend / product skin types
export const ROUTINE_SKIN_TYPE_OPTIONS: readonly SkinType[] = [
  "oily",
  "dry",
  "combination",
  "sensitive",
  "normal",
  "acne-prone",
] as const;

export function skinTypeLabel(t: SkinType): string {
  return t
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
}
