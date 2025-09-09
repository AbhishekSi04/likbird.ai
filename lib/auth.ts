import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET = process.env.AUTH_SECRET || "dev-secret";

export function signSession(payload: { userId: string; email: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifySession(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, SECRET) as any;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function getSessionCookie(token: string) {
  const week = 7 * 24 * 60 * 60;
  return `app_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${week};`;
}

export const clearSessionCookie = `app_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;`;


