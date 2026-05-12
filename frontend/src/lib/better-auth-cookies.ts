import type { NextRequest } from "next/server";

/** Better Auth default prefix + session token cookie (may be chunked: `.0`, `.1`, …). */
export function hasBetterAuthSessionCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some(({ name }) => {
    if (name === "better-auth.session_token") return true;
    if (name.startsWith("better-auth.session_token.")) return true;
    return false;
  });
}
