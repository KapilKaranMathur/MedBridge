import { NextResponse } from "next/server";
import { PROTECTED_ROUTES, verifyJWT } from "./middleware-utils";

export async function middleware(req) {
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
