import { PRODUCT_CATEGORY_VALUES } from "../config/productCategories";
import type { ProductCategory } from "../types/product";
import type { CreateRoutineProductInput } from "../types/routine";
import {
  parseOptionalPositiveInt,
  parsePositiveInt,
  parseUserNote,
  RoutineProductValidationError,
} from "./routineProductParse";

export const MAX_ROUTINE_PRODUCTS = 20;

export { RoutineProductValidationError };

export function parseProductCategory(
  value: unknown,
  label = "category",
): ProductCategory {
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

function parseItem(
  entry: unknown,
  index: number,
  amStepCounter: { value: number },
  pmStepCounter: { value: number },
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

  let amNote = parseUserNote(o.amNote, `items[${index}].amNote`);
  let pmNote = parseUserNote(o.pmNote, `items[${index}].pmNote`);
  const legacyNote = parseUserNote(o.userNote, `items[${index}].userNote`);
  if (legacyNote) {
    if (o.timeOfDay === "PM") pmNote = legacyNote;
    else amNote = legacyNote;
  }

  let amStepOrder = parseOptionalPositiveInt(
    o.amStepOrder,
    `items[${index}].amStepOrder`,
  );
  let pmStepOrder = parseOptionalPositiveInt(
    o.pmStepOrder,
    `items[${index}].pmStepOrder`,
  );

  if (amNote && amStepOrder === null) {
    amStepOrder = ++amStepCounter.value;
  }
  if (pmNote && pmStepOrder === null) {
    pmStepOrder = ++pmStepCounter.value;
  }

  return {
    productId,
    category,
    amNote,
    pmNote,
    amStepOrder,
    pmStepOrder,
  };
}

// Normalizes bulk/upsert payloads. One row per productId.
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

  const amStepCounter = { value: 0 };
  const pmStepCounter = { value: 0 };
  const parsed = raw.map((entry, index) =>
    parseItem(entry, index, amStepCounter, pmStepCounter),
  );

  const byProduct = new Map<
    number,
    Omit<CreateRoutineProductInput, "routineId">
  >();
  for (const item of parsed) {
    const prev = byProduct.get(item.productId);
    if (!prev) {
      byProduct.set(item.productId, item);
      continue;
    }
    byProduct.set(item.productId, {
      productId: item.productId,
      category: item.category,
      amNote: item.amNote ?? prev.amNote,
      pmNote: item.pmNote ?? prev.pmNote,
      amStepOrder: item.amStepOrder ?? prev.amStepOrder,
      pmStepOrder: item.pmStepOrder ?? prev.pmStepOrder,
    });
  }
  return [...byProduct.values()];
}
