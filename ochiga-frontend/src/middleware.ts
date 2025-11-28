// ./src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that need no auth
const PUBLIC_PATHS = ["/", "/auth", "/auth/login", "/auth/signup"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow all public routes and anything inside /auth
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Read user role from cookies
  const role = req.cookies.get("role")?.value;

  // Redirect resident trying to access manager dashboard
  if (role === "resident" && pathname.startsWith("/manager-dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect manager trying to access resident dashboard
  if (role === "manager" && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/manager-dashboard", req.url));
  }

  return NextResponse.next();
}

// Only run middleware for pages, not static files
export const config = {
  matcher: ["/((?!_next|static|.*\\..*).*)"],
};
