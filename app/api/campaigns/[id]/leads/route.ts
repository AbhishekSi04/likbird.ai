import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const status = searchParams.get("status")?.trim() || "";
  const where: any = {
    campaignId: params.id,
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { company: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},
      status ? { status: status as any } : {},
    ],
  };

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      company: true,
      status: true,
      lastContactDate: true,
    },
  });
  return NextResponse.json(leads);
}


