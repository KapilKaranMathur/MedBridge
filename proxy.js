import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const PROTECTED_ROUTES = [
  "/onboarding",
  "/dashboard",
  "/appointments",
  "/api/protected",
];

async function verifyJWT(token) {
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  // Only protect listed routes, not "/"
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
