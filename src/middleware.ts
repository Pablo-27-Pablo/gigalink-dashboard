// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // 1. GUEST GUARD: If user is logged in and tries to access /login
  if (token && pathname === "/login") {
    try {
      const payload = decodeJwt(token);
      const userPortal = payload.portal as string;

      // Redirect them to their specific home based on their portal role
      if (userPortal === "distributor") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard/profile", request.url));
    } catch (error) {
      // If token is invalid, let them stay on login but maybe clear the cookie
      const response = NextResponse.next();
      response.cookies.delete("token");
      return response;
    }
  }

  // 2. AUTH GUARD: If trying to access protected areas without a token
  if (!token) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/vendor") ||
      pathname.startsWith("/distributor")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  try {
    const payload = decodeJwt(token);
    const userPortal = payload.portal as string;

    // 3. Protect Distributor Routes
    if (pathname.startsWith("/distributor") && userPortal !== "distributor") {
      return NextResponse.redirect(new URL("/dashboard/profile", request.url));
    }

    // 4. Protect Vendor Routes
    if (
      pathname.startsWith("/dashboard/vendor") &&
      userPortal !== "agent" &&
      userPortal !== "vendor"
    ) {
      return NextResponse.redirect(new URL("/dashboard/profile", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/login", // <--- ADD THIS
    "/dashboard/:path*",
    "/vendor/:path*",
    "/distributor/:path*",
    "/superadmin/:path*",
  ],
};
