import { NextResponse } from "next/server";
import { PROTECTED_ROUTES, verifyJWT } from "./lib/middleware-utils";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const needsAuth = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("token")?.value;
  const isValid = token && (await verifyJWT(token));

  if (!isValid) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|favicon.ico).*)"],
};