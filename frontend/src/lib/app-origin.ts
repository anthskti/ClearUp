/**
 * Fallback origin when `headers()` is unavailable (e.g. outside a request).
 * Prefer setting `NEXT_PUBLIC_APP_URL` to the exact URL users open (include `www` if you use it).
 */
export function getAppOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL?.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
