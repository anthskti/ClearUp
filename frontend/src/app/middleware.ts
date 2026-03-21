import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get("better-auth.session_token");

  // Guest Routes
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/reset-password");

  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Auth Routes
  const ProtectedPages = pathname.startsWith("/profile");
  if (ProtectedPages && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
