import {
  parseOptionalStepField,
  parseOptionalUserNote,
  parsePositiveInt,
  RoutineProductValidationError,
} from "./routineProductParse";
import { MAX_ROUTINE_PRODUCTS } from "./routineProductItems";

export type RoutineNoteUpdateInput = {
  productId: number;
  amNote?: string | null;
  pmNote?: string | null;
  amStepOrder?: number | null;
  pmStepOrder?: number | null;
};

function parseNoteUpdate(entry: unknown, index: number): RoutineNoteUpdateInput {
  if (!entry || typeof entry !== "object") {
    throw new RoutineProductValidationError(`updates[${index}] must be an object`);
  }
  const o = entry as Record<string, unknown>;
  const productId = parsePositiveInt(
    o.productId,
    `updates[${index}].productId`,
  );

  const amNote = parseOptionalUserNote(o.amNote, `updates[${index}].amNote`);
  const pmNote = parseOptionalUserNote(o.pmNote, `updates[${index}].pmNote`);
  const amStepOrder = parseOptionalStepField(
    o.amStepOrder,
    `updates[${index}].amStepOrder`,
  );
  const pmStepOrder = parseOptionalStepField(
    o.pmStepOrder,
    `updates[${index}].pmStepOrder`,
  );

  if (
    amNote === undefined &&
    pmNote === undefined &&
    amStepOrder === undefined &&
    pmStepOrder === undefined
  ) {
    throw new RoutineProductValidationError(
      `updates[${index}] must include at least one note field`,
    );
  }

  const update: RoutineNoteUpdateInput = { productId };
  if (amNote !== undefined) update.amNote = amNote;
  if (pmNote !== undefined) update.pmNote = pmNote;
  if (amStepOrder !== undefined) update.amStepOrder = amStepOrder;
  if (pmStepOrder !== undefined) update.pmStepOrder = pmStepOrder;
  return update;
}

/** Validates batch usage-note saves from PATCH /routines/id/:id/notes. */
export function parseRoutineNoteUpdates(raw: unknown): RoutineNoteUpdateInput[] {
  if (!Array.isArray(raw)) {
    throw new RoutineProductValidationError("updates must be an array");
  }
  if (raw.length === 0) {
    throw new RoutineProductValidationError(
      "updates must include at least one product",
    );
  }
  if (raw.length > MAX_ROUTINE_PRODUCTS) {
    throw new RoutineProductValidationError(
      `max ${MAX_ROUTINE_PRODUCTS} note updates per request`,
    );
  }

  const byProduct = new Map<number, RoutineNoteUpdateInput>();
  for (let i = 0; i < raw.length; i += 1) {
    const parsed = parseNoteUpdate(raw[i], i);
    const prev = byProduct.get(parsed.productId);
    byProduct.set(parsed.productId, prev ? { ...prev, ...parsed } : parsed);
  }
  return [...byProduct.values()];
}

export function toNoteOnlyPatch(
  update: RoutineNoteUpdateInput,
): Pick<
  RoutineNoteUpdateInput,
  "amNote" | "pmNote" | "amStepOrder" | "pmStepOrder"
> {
  const patch: Pick<
    RoutineNoteUpdateInput,
    "amNote" | "pmNote" | "amStepOrder" | "pmStepOrder"
  > = {};
  if (update.amNote !== undefined) patch.amNote = update.amNote;
  if (update.pmNote !== undefined) patch.pmNote = update.pmNote;
  if (update.amStepOrder !== undefined) patch.amStepOrder = update.amStepOrder;
  if (update.pmStepOrder !== undefined) patch.pmStepOrder = update.pmStepOrder;
  return patch;
}
