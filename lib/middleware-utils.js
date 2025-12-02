import { jwtVerify } from "jose";

export const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export const PROTECTED_ROUTES = [
  "/onboarding",
  "/dashboard",
  "/appointments",
  "/api/protected",
];

export async function verifyJWT(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}