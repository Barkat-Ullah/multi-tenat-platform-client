/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { normalizeRole } from "@/utils/roles";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const path = request.nextUrl.pathname;

  // 1. Auth pages: If logged in, don't allow access to login/register
  const authPages = ["/login", "/register", "/forget-password", "/otp", "/reset-password"];
  if (authPages.some((page) => path.startsWith(page))) {
    if (token) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  // 2. Protected routes: If not logged in, redirect to login
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Public routes: If no token, just allow access (Home, Properties, etc.)
  if (!token) {
    return NextResponse.next();
  }

  try {
    const decoded: { role: string; exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp <= currentTime) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }

    const role = normalizeRole(decoded.role);

    // ADMIN only
    if (path.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // CLINIC only
    if (path.startsWith("/dashboard/clinic") && role !== "CLINIC") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // ORGINIZER only
    if (path.startsWith("/dashboard/orginizer") && role !== "ORGINIZER") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // USER only. Legacy backend AGENCY is normalized to USER for now.
    if (path.startsWith("/dashboard/user") && role !== "USER") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (err: any) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
