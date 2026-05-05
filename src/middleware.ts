import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

function preventAuthCache(response: NextResponse) {
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session2")?.value;
  const { pathname } = request.nextUrl;

  // 1. GUEST GUARD (Login page)
  if (pathname === "/login") {
    if (!token) return preventAuthCache(NextResponse.next());

    try {
      // If already logged in, redirect to dashboard
      return preventAuthCache(
        NextResponse.redirect(new URL("/dashboard", request.url)),
      );
    } catch {
      const response = NextResponse.next();
      response.cookies.delete("session2");
      return preventAuthCache(response);
    }
  }

  // 2. AUTH GUARD
  // If no token exists, redirect to login
  if (!token) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session2"); // Ensure cookie is cleared
    response.cookies.delete("distributorId");
    response.cookies.delete("vendorId");
    response.cookies.delete("superadminId");
    return preventAuthCache(response);
  }

  try {
    const payload = decodeJwt(token);
    const userPortal = payload.portal as string;

    // 3. ROLE-BASED ACCESS CONTROL (RBAC)
    if (pathname.startsWith("/distributor") && userPortal !== "distributor") {
      return preventAuthCache(
        NextResponse.redirect(new URL("/dashboard", request.url)),
      );
    }

    if (pathname.startsWith("/superadmin") && userPortal !== "superadmin") {
      return preventAuthCache(
        NextResponse.redirect(new URL("/dashboard", request.url)),
      );
    }

    if (pathname.startsWith("/vendor")) {
      const isAuthorized = ["agent", "vendor", "superadmin"].includes(
        userPortal,
      );
      if (!isAuthorized) {
        return preventAuthCache(
          NextResponse.redirect(new URL("/dashboard", request.url)),
        );
      }
    }

    return preventAuthCache(NextResponse.next());
  } catch {
    // If token is invalid/expired
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session2");
    response.cookies.delete("distributorId");
    response.cookies.delete("vendorId");
    response.cookies.delete("superadminId");
    return preventAuthCache(response);
  }
}

// Ensure middleware runs on all relevant protected routes
export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/vendor/:path*",
    "/distributor/:path*",
    "/admin/:path*",
  ],
};
