import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasBetterAuthSessionCookie } from "@/lib/better-auth-cookies";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = hasBetterAuthSessionCookie(request);

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/verify-email");

  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isProfilePage = pathname.startsWith("/profile");
  if (isProfilePage && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isAdminPage = pathname.startsWith("/admin");
  if (isAdminPage && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
