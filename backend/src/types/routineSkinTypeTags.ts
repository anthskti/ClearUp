import type { SkinType } from "./product";

const ALLOWED: readonly SkinType[] = [
  "oily",
  "dry",
  "combination",
  "sensitive",
  "normal",
  "acne-prone",
] as const;

const ALLOWED_SET = new Set<string>(ALLOWED);

export function sanitizeSkinTypeTags(input: unknown): SkinType[] {
  if (!Array.isArray(input)) {
    return [];
  }
  const out: SkinType[] = [];
  for (const x of input) {
    const s = String(x).trim();
    if (ALLOWED_SET.has(s)) {
      out.push(s as SkinType);
    }
  }
  return [...new Set(out)];
}

export { ALLOWED as ROUTINE_SKIN_TYPE_OPTIONS };
