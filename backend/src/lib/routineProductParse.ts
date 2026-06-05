import { MAX_USER_NOTE_LENGTH } from "./routineSecurity";

export class RoutineProductValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RoutineProductValidationError";
  }
}

export function parsePositiveInt(value: unknown, label: string): number {
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

/** Bulk create: missing step order becomes null. */
export function parseOptionalPositiveInt(
  value: unknown,
  label: string,
): number | null {
  if (value === undefined || value === null || value === "") return null;
  return parsePositiveInt(value, label);
}

/** PATCH payloads: undefined means "leave unchanged". */
export function parseOptionalStepField(
  value: unknown,
  label: string,
): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return parsePositiveInt(value, label);
}

/** PATCH payloads: undefined means "leave unchanged". */
export function parseOptionalUserNote(
  value: unknown,
  label: string,
): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (typeof value !== "string") {
    throw new RoutineProductValidationError(`${label} must be a string`);
  }
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > MAX_USER_NOTE_LENGTH) {
    throw new RoutineProductValidationError(
      `${label} must be at most ${MAX_USER_NOTE_LENGTH} characters`,
    );
  }
  return trimmed;
}

/** Bulk create: missing note becomes null. */
export function parseUserNote(value: unknown, label: string): string | null {
  const parsed = parseOptionalUserNote(value, label);
  return parsed === undefined ? null : parsed;
}
