import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { signSession, verifyPassword, getSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as { email: string; password: string };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  const token = signSession({ userId: user.id, email: user.email });
  return new NextResponse(JSON.stringify({ id: user.id, email: user.email, name: user.name }), {
    headers: { "Set-Cookie": getSessionCookie(token), "Content-Type": "application/json" },
  });
}


