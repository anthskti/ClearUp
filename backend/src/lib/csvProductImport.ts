import type { ProductCategory, SkinType } from "../types/product";

const VALID_CATEGORIES = new Set<ProductCategory>([
  "cleanser",
  "toner",
  "essence",
  "serum",
  "moisturizer",
  "sunscreen",
  "other",
]);

const VALID_SKIN_TYPES = new Set<SkinType>([
  "oily",
  "dry",
  "combination",
  "sensitive",
  "normal",
  "acne-prone",
]);

/** RFC 4180-style parser for pasted scraper CSV (quoted fields, commas inside quotes). */
export function parseCsvText(csvText: string): Record<string, string>[] {
  const text = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const table: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      row.push(field);
      field = "";
    } else if (c === "\n" && !inQuotes) {
      row.push(field);
      field = "";
      if (row.some((cell) => cell.length > 0)) {
        table.push(row);
      }
      row = [];
    } else {
      field += c;
    }
  }
  row.push(field);
  if (row.some((cell) => cell.length > 0)) {
    table.push(row);
  }

  if (table.length < 2) return [];

  const headers = table[0].map((h) => h.trim().toLowerCase());
  return table.slice(1).map((values) => {
    const record: Record<string, string> = {};
    headers.forEach((header, idx) => {
      record[header] = (values[idx] ?? "").trim();
    });
    return record;
  });
}

export function parseLabels(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s !== "-" && s !== "—");
}

export function parseSkinTypes(raw: string | undefined): SkinType[] {
  if (!raw?.trim()) return [];
  const normalized = raw.trim().toLowerCase();
  if (normalized === "n/a" || normalized === "na" || normalized === "-") {
    return [];
  }
  const out: SkinType[] = [];
  for (const part of raw.split(/[,;|]/)) {
    const value = part.trim().toLowerCase();
    if (VALID_SKIN_TYPES.has(value as SkinType)) {
      out.push(value as SkinType);
    }
  }
  return out;
}

export function parseScraperPrice(raw: string | undefined): number {
  if (!raw?.trim()) return 0;
  const cleaned = raw
    .replace(/CA\$?/gi, "")
    .replace(/\u00a0/g, " ")
    .trim();
  const n = parseFloat(cleaned.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function parseInstructions(raw: string | undefined): string[] {
  const t = raw?.trim();
  if (!t || t.toLowerCase() === "n/a") return [];

  const numbered = t
    .split(/(?=\s*\d+\.\s+)/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (numbered.length > 1) return numbered;

  return [t];
}

export function parseImageUrls(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  if (raw.includes("|")) {
    return raw
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [raw.trim()];
}

export function parseCategory(raw: string | undefined): ProductCategory | null {
  const value = raw?.trim().toLowerCase();
  if (!value) return null;
  if (VALID_CATEGORIES.has(value as ProductCategory)) {
    return value as ProductCategory;
  }
  return null;
}

export function isScraperRowSuccessful(status: string | undefined): boolean {
  const s = status?.trim().toLowerCase();
  if (!s) return true;
  return s === "success";
}

export const SCRAPER_DEFAULT_MERCHANT_NAME = "YesStyle";
