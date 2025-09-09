import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  return new NextResponse(null, { headers: { "Set-Cookie": clearSessionCookie } });
}


