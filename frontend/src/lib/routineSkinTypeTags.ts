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

const ALLOWED_SET = new Set<string>(ROUTINE_SKIN_TYPE_OPTIONS);

// Parse comma-separated tags from URL; only allowed enum values kept. 
export function parseSkinTypeTagsFromParam(param: string | undefined): SkinType[] {
  if (!param?.trim()) return [];
  const out: SkinType[] = [];
  for (const part of param.split(",")) {
    const s = part.trim();
    if (ALLOWED_SET.has(s)) {
      out.push(s as SkinType);
    }
  }
  return [...new Set(out)];
}

export function skinTypeLabel(t: SkinType): string {
  return t
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
}
