import { jwtVerify } from "jose";

export const PROTECTED_ROUTES = [
  "/onboarding",
  "/dashboard",
  "/appointments",
  "/api/protected",
];

export async function verifyJWT(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}