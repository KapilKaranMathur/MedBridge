import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

function parseTokenFromCookieHeader(cookieHeader) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map(p => p.trim());
  for (const p of parts) {
    if (p.startsWith("token=")) return p.slice("token=".length);
  }
  return null;
}

export async function GET(request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const token = parseTokenFromCookieHeader(cookieHeader);

    if (!token) {
      return NextResponse.json({ ok: true, user: null });
    }

    if (!JWT_SECRET) {
      return NextResponse.json({ ok: false, error: "JWT_SECRET not set" }, { status: 500 });
    }

    try {
      const encoder = new TextEncoder();
      const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET));
      return NextResponse.json({ ok: true, user: payload });
    } catch (err) {
      return NextResponse.json({ ok: false, error: "Invalid token: " + (err.message || err) }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}
