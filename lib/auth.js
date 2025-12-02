import jwt from "jsonwebtoken";
import prisma from "./prisma";

const TOKEN_COOKIE_NAMES = [
  "next-auth.session-token",
  "next-auth.callback-url",
  "next-auth.csrf-token",
  "token",
];

function getAuthHeaderToken(request) {
  const header = request.headers.get?.("authorization") || request.headers.get?.("Authorization");
  if (!header) return null;
  const parts = header.split(" ");
  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") return parts[1];
  return null;
}

function getCookieToken(request) {
  try {
    if (typeof request.cookies?.get === "function") {
      for (const name of TOKEN_COOKIE_NAMES) {
        const c = request.cookies.get(name);
        if (c?.value) return c.value;
      }
    } else {
      const cookieHeader = request.headers.get("cookie") || "";
      if (!cookieHeader) return null;
      const pairs = cookieHeader.split(";").map(s => s.trim());
      for (const name of TOKEN_COOKIE_NAMES) {
        const kv = pairs.find(p => p.startsWith(name + "="));
        if (kv) return kv.split("=")[1];
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function getCurrentUser(request) {
  if (!request) return null;
  let token = getAuthHeaderToken(request);

  if (!token) token = getCookieToken(request);
  if (!token) return null;


  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "devsecret";
  let payload;
  try {
    payload = jwt.verify(token, secret);
  } catch (e) {

    console.debug("auth: token verify failed:", e?.message ?? e);
    return null;
  }

  const userId = payload?.userId || payload?.id || payload?.sub || payload?.user?.id;
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
    });
    return user || null;
  } catch (e) {
    console.error("auth: prisma lookup failed:", e);
    return null;
  }
}
