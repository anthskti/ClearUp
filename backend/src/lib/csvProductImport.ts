import type { ProductCategory, SkinType } from "../types/product";

const VALID_CATEGORIES = new Set<ProductCategory>([
  "cleanser",
  "toner",
  "essence",
  "serum",
  "eyecare",
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
    .filter((s) => s.length > 0);
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

// Periods in these tokens must not start a new instruction step (e.g. "Dr. Althea").
// Extend when scraper copy includes other dotted names or abbreviations.
const INSTRUCTION_PERIOD_EXCEPTIONS = [
  "Dr",
  "Mr",
  "Mrs",
  "Ms",
  "Mx",
  "Sr",
  "Jr",
  "St",
  "Co",
  "Inc",
  "Ltd",
  "vs",
  "etc",
] as const;

const INSTRUCTION_STEP_SPLIT = new RegExp(
  `(?<!(?:${INSTRUCTION_PERIOD_EXCEPTIONS.map((abbr) =>
    abbr.replace(/\./g, "\\."),
  ).join("|")}))\\.\\s+`,
  "gi",
);

export function parseInstructions(raw: string | undefined): string[] {
  const trimmed = raw?.trim();
  if (!trimmed || trimmed.toLowerCase() === "n/a") return [];

  const segments = trimmed
    .split(INSTRUCTION_STEP_SPLIT)
    .map((s) => s.trim())
    .filter(Boolean);
  if (segments.length <= 1) {
    return [trimmed];
  }

  return segments.map((seg) => (seg.endsWith(".") ? seg : `${seg}.`));
}

export function parseImageUrls(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  const trimmed = raw.trim();

  if (trimmed.includes("|")) {
    return trimmed
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Comma-separated absolute URLs (e.g. The Ordinary scraper rows).
  // Split only before "http(s)://" so query-string commas stay intact.
  if (/,https?:\/\//i.test(trimmed)) {
    return trimmed
      .split(/,(?=https?:\/\/)/i)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [trimmed];
}

// Expands pipe/comma-joined strings stored as a single array element.
export function normalizeImageUrls(value: unknown): string[] {
  if (!Array.isArray(value)) {
    if (typeof value === "string") return parseImageUrls(value);
    return [];
  }

  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    out.push(...parseImageUrls(item));
  }
  return out;
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

/** CSV `merchant` column; falls back to YesStyle when blank. */
export function parseMerchantName(raw: string | undefined): string {
  const trimmed = raw?.trim();
  return trimmed || SCRAPER_DEFAULT_MERCHANT_NAME;
}
