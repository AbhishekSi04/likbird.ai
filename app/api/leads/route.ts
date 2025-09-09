import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") ?? undefined;
  const limitParam = searchParams.get("limit");
  const take = Math.min(Math.max(Number(limitParam ?? PAGE_SIZE), 1), 100);
  const q = searchParams.get("q")?.trim() || "";
  const status = searchParams.get("status")?.trim() || "";

  const where = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
              { company: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {},
      status ? { status: status as any } : {},
    ],
  } as const;

  const items = await prisma.lead.findMany({
    take: take + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { id: "asc" },
    where,
    select: {
      id: true,
      name: true,
      email: true,
      company: true,
      status: true,
      lastContactDate: true,
      campaign: { select: { id: true, name: true } },
    },
  });

  let nextCursor: string | null = null;
  if (items.length > take) {
    const next = items.pop();
    nextCursor = next?.id ?? null;
  }

  return NextResponse.json({ items, nextCursor });
}


