import jwt from "jsonwebtoken";

export function signToken(payload, opts = {}) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d", ...opts });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}
