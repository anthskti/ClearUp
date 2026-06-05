// Must match backend `routineSecurity.ts`, sent on state-changing API calls.
export const CLEARUP_MUTATION_HEADER = "x-clearup-client";
export const CLEARUP_MUTATION_HEADER_VALUE = "1";

export function mutationHeaders(
  extra?: HeadersInit,
): Record<string, string> {
  const base: Record<string, string> = {
    [CLEARUP_MUTATION_HEADER]: CLEARUP_MUTATION_HEADER_VALUE,
  };
  if (!extra) return base;
  if (extra instanceof Headers) {
    extra.forEach((value, key) => {
      base[key] = value;
    });
    return base;
  }
  if (Array.isArray(extra)) {
    for (const [key, value] of extra) {
      base[key] = value;
    }
    return base;
  }
  return { ...base, ...extra };
}
