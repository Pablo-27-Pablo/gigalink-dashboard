import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session2")?.value;
  const { pathname } = request.nextUrl;

  // 1. GUEST GUARD (Login page)
  if (pathname === "/login") {
    if (!token) return NextResponse.next();

    try {
      // If logged in → always go to /dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch {
      const response = NextResponse.next();
      response.cookies.delete("session2");
      return response;
    }
  }

  // 2. AUTH GUARD
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const payload = decodeJwt(token);
    const userPortal = payload.portal as string;

    // 3. RBAC (optional: still protect routes, but redirect to same dashboard)

    if (pathname.startsWith("/distributor") && userPortal !== "distributor") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.startsWith("/superadmin") && userPortal !== "superadmin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.startsWith("/vendor")) {
      const isAuthorized = ["agent", "vendor", "superadmin"].includes(
        userPortal,
      );
      if (!isAuthorized) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session2");
    return response;
  }
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/vendor/:path*",
    "/distributor/:path*",
    "/superadmin/:path*",
  ],
};
