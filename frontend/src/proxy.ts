import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function hasBetterAuthSessionCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some(({ name }) => {
    if (name === "better-auth.session_token") return true;
    if (name.startsWith("better-auth.session_token.")) return true;
    return false;
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/verify-email");

  if (isAuthPage && hasBetterAuthSessionCookie(request)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
