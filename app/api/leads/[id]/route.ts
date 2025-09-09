import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      campaign: { select: { id: true, name: true, status: true, createdAt: true } },
    },
  });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { status, lastContactDate } = body as { status?: string; lastContactDate?: string };
  
  const updateData: any = {};
  if (status) {
    updateData.status = status as "pending" | "contacted" | "responded" | "converted";
  }
  if (lastContactDate) {
    updateData.lastContactDate = new Date(lastContactDate);
  }
  
  const updated = await prisma.lead.update({
    where: { id: params.id },
    data: updateData,
  });
  return NextResponse.json(updated);
}


