import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
      include: {
        _count: { select: { leads: true } },
        leads: { select: { status: true } },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const shaped = {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      createdAt: campaign.createdAt,
      _count: campaign._count,
      successCount: campaign.leads.filter((l) => l.status === "converted").length,
    };

    return NextResponse.json(shaped);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json({ error: "Failed to fetch campaign" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, status } = await req.json();
    
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (status !== undefined) updateData.status = status;

    const campaign = await prisma.campaign.update({
      where: { id: params.id },
      data: updateData,
      include: {
        _count: { select: { leads: true } },
        leads: { select: { status: true } },
      },
    });

    const shaped = {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      createdAt: campaign.createdAt,
      _count: campaign._count,
      successCount: campaign.leads.filter((l) => l.status === "converted").length,
    };

    return NextResponse.json(shaped);
  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
  }
}