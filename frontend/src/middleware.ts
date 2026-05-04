import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getEffectiveUser } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("better-auth.session_token");

  // Guest Routes
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/verify-email");

  // Users with sessions shouldn't be able to access
  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // Protected Pages
  const ProtectedPages = pathname.startsWith("/profile");

  if (ProtectedPages && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin Routes: session cookie --> role comes from backend `/api/auth/me`
  const isAdminPage = pathname.startsWith("/admin");

  if (isAdminPage) {
    // not logged in
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const cookieHeader = request.headers.get("cookie") ?? "";
    const user = await getEffectiveUser(cookieHeader);

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
