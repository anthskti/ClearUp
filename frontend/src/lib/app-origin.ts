/**
 * Canonical origin of the Next app (where Better Auth cookies must live for Option A).
 * Set NEXT_PUBLIC_APP_URL in dev/prod so server code matches the URL users open (e.g. custom domain).
 */
export function getAppOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;
  return "http://localhost:3000";
}
