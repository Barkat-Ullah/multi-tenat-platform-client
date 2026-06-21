/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { normalizeRole } from "@/utils/roles";
import { isPreviewMode } from "@/utils/previewMode";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const path = request.nextUrl.pathname;

  const authPages = ["/login", "/register", "/forget-password", "/otp", "/reset-password"];
  const isAuthPage = authPages.some((page) => path.startsWith(page));

  if (isPreviewMode && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));

  // 1. Protected routes: If not logged in, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Public and auth routes: If no token, allow access
  if (!token) {
    return NextResponse.next();
  }

  try {
    const decoded: { role: string; exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp <= currentTime) {
      const response = isAuthPage
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }

    const role = normalizeRole(decoded.role);

    // Auth pages: If already logged in with a valid token, don't allow access
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }

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
    const response = isAuthPage
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
