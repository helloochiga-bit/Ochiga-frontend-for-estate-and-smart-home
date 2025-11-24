// ./src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/auth", "/auth/login", "/auth/signup"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  // Check role from cookie/localStorage
  const role = req.cookies.get("role")?.value;

  if (role === "resident" && pathname.startsWith("/manager-dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (role === "manager" && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/manager-dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };
