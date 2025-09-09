import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hashPassword, signSession, getSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { name, email, password } = (await req.json()) as {
    name?: string;
    email: string;
    password: string;
  };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 400 });

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });
  const token = signSession({ userId: user.id, email: user.email });
  return new NextResponse(JSON.stringify({ id: user.id, email: user.email, name: user.name }), {
    headers: { "Set-Cookie": getSessionCookie(token), "Content-Type": "application/json" },
  });
}


