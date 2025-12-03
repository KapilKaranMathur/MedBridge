import { NextResponse } from "next/server";
import { PROTECTED_ROUTES, verifyJWT } from "./lib/middleware-utils";

export async function middleware(req) {
  if (!process.env.JWT_SECRET) {
    console.error("CRITICAL: JWT_SECRET is not set in environment variables.");

  }

  const { pathname } = req.nextUrl;

  const needsAuth = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (pathname.startsWith("/doctor")) {
    const token = req.cookies.get("token")?.value;
    const payload = token && (await verifyJWT(token));

    if (!payload) {
        const signInUrl = new URL("/sign-in", req.url);
        signInUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(signInUrl);
    }

    if (payload.role !== "doctor") {
        return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/patient")) {
    const token = req.cookies.get("token")?.value;
    const payload = token && (await verifyJWT(token));

    if (!payload) {
        const signInUrl = new URL("/sign-in", req.url);
        signInUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(signInUrl);
    }

    if (payload.role !== "patient" && payload.role !== "user") {
         return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("token")?.value;
  const payload = token && (await verifyJWT(token));

  if (!payload) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};