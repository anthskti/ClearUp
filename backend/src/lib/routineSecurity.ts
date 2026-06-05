/** Shared limits and CSRF contract for routine/builder mutations. */

export const CLEARUP_MUTATION_HEADER = "x-clearup-client";
export const CLEARUP_MUTATION_HEADER_VALUE = "1";

export const MAX_USER_NOTE_LENGTH = 4096;
export const MAX_ROUTINE_NAME_LENGTH = 200;
export const MAX_ROUTINE_DESCRIPTION_LENGTH = 8000;

export class RoutineProductReplaceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RoutineProductReplaceError";
  }
}

export function truncateRoutineText(
  value: string,
  maxLength: number,
): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength);
}
