// ./src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/auth", "/auth/login", "/auth/signup", "/auth/onboarding"];

// Runs on every request because matcher is `/:path*`
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  // Read role cookie (set by frontend when user logs in/onboarding or backend if it sets same cookie)
  const role = req.cookies.get("role")?.value;

  // If role not present, redirect to login
  if (!role) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // If resident tries to access manager pages redirect them
  if (role === "resident" && pathname.startsWith("/manager-dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if ((role === "manager" || role === "estate") && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/manager-dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };
