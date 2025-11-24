// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PATHS = ["/", "/auth", "/auth/login", "/auth/signup"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("ochiga_token")?.value;

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  try {
    const payload: any = jwt.verify(token, process.env.NEXT_PUBLIC_APP_JWT_SECRET!);

    // Role-based dashboard redirection
    if (payload.role === "resident") {
      // Residents can only access resident dashboards
      if (!pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } else if (payload.role === "manager") {
      // Managers can only access manager dashboards
      if (!pathname.startsWith("/manager-dashboard")) {
        return NextResponse.redirect(new URL("/manager-dashboard", req.url));
      }
    } else {
      // Unknown role → redirect to login
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // All checks passed → allow access
    return NextResponse.next();
  } catch (err) {
    console.error("❌ Invalid token in middleware:", err);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/:path*"], // apply middleware to all routes
};
