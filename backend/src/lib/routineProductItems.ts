import { PRODUCT_CATEGORY_VALUES } from "../config/productCategories";
import type { ProductCategory } from "../types/product";
import type { CreateRoutineProductInput, TimeOfDay } from "../types/routine";

export const MAX_ROUTINE_PRODUCTS = 20;

export class RoutineProductValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RoutineProductValidationError";
  }
}

function parsePositiveInt(value: unknown, label: string): number {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? parseInt(value, 10)
        : NaN;
  if (!Number.isFinite(n) || n < 1) {
    throw new RoutineProductValidationError(`${label} must be a positive integer`);
  }
  return n;
}

export function parseProductCategory(value: unknown, label = "category"): ProductCategory {
  if (typeof value !== "string") {
    throw new RoutineProductValidationError(`${label} must be a string`);
  }
  if (!PRODUCT_CATEGORY_VALUES.includes(value as ProductCategory)) {
    throw new RoutineProductValidationError(`${label} is invalid`);
  }
  return value as ProductCategory;
}

function parseCategory(value: unknown, index: number): ProductCategory {
  return parseProductCategory(value, `items[${index}].category`);
}

function parseTimeOfDay(value: unknown): TimeOfDay {
  if (value === "PM") return "PM";
  if (value === "AM" || value === undefined || value === null) return "AM";
  throw new RoutineProductValidationError(
    'timeOfDay must be "AM" or "PM"',
  );
}

function parseStepOrder(value: unknown, label: string): number | undefined {
  if (value === undefined || value === null) return undefined;
  return parsePositiveInt(value, label);
}

function parseUserNote(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") {
    throw new RoutineProductValidationError("userNote must be a string");
  }
  return value;
}

function parseItem(
  entry: unknown,
  index: number,
  counters: { AM: number; PM: number },
): Omit<CreateRoutineProductInput, "routineId"> {
  if (!entry || typeof entry !== "object") {
    throw new RoutineProductValidationError(`items[${index}] must be an object`);
  }
  const o = entry as Record<string, unknown>;
  const productId = parsePositiveInt(
    o.productId,
    `items[${index}].productId`,
  );
  const category = parseCategory(o.category, index);
  const timeOfDay = parseTimeOfDay(o.timeOfDay);
  const explicitStep = parseStepOrder(
    o.stepOrder,
    `items[${index}].stepOrder`,
  );
  const stepOrder =
    explicitStep ??
    (() => {
      counters[timeOfDay] += 1;
      return counters[timeOfDay];
    })();
  const userNote = parseUserNote(o.userNote);

  return { productId, category, timeOfDay, stepOrder, userNote };
}

/**
 * Normalizes bulk/upsert payloads. Older clients may omit timeOfDay, stepOrder, and userNote;
 * defaults: AM, ascending stepOrder per time block, null note.
 */
export function parseRoutineProductItems(
  raw: unknown,
  options: { fieldName?: "products" | "items" } = {},
): Omit<CreateRoutineProductInput, "routineId">[] {
  const fieldName = options.fieldName ?? "products";
  if (!Array.isArray(raw)) {
    throw new RoutineProductValidationError(`${fieldName} must be an array`);
  }
  if (raw.length > MAX_ROUTINE_PRODUCTS) {
    throw new RoutineProductValidationError(
      `max ${MAX_ROUTINE_PRODUCTS} products per routine`,
    );
  }
  const counters = { AM: 0, PM: 0 };
  return raw.map((entry, index) => parseItem(entry, index, counters));
}
