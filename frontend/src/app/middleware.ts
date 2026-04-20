import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get("better-auth.session_token");
  const isVerifyPage = pathname.startsWith("/verify-email");

  // Guest Routes
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/forgot-password") ||
    isVerifyPage;

  // Keep verify-email accessible even when a session exists.
  if (isAuthPage && sessionCookie && !isVerifyPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Auth Routes
  const ProtectedPages = pathname.startsWith("/profile");
  if (ProtectedPages && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
