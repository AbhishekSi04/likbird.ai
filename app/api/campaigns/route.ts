import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    // For now, we'll use a demo user ID. In a real app, this would come from the session
    const demoUserId = "demo-user-id";
    
    // Ensure the demo user exists
    const user = await prisma.user.upsert({
      where: { email: "demo@example.com" },
      update: {},
      create: {
        id: demoUserId,
        email: "demo@example.com",
        passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // demo123
        name: "Demo User",
      },
    });

    const where: any = {
      ownerId: user.id,
    };
    if (status && status !== "all") {
      where.status = status;
    }

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        _count: { select: { leads: true } },
        leads: { select: { status: true } },
      },
      orderBy: { [sort]: order },
    });

    const shaped = campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      createdAt: campaign.createdAt,
      _count: campaign._count,
      successCount: campaign.leads.filter((l) => l.status === "converted").length,
    }));

    return NextResponse.json(shaped);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, status = "draft" } = await req.json();
    
    if (!name) {
      return NextResponse.json({ error: "Campaign name is required" }, { status: 400 });
    }

    // For now, we'll use a demo user ID. In a real app, this would come from the session
    const demoUserId = "demo-user-id";
    
    // Ensure the demo user exists
    const user = await prisma.user.upsert({
      where: { email: "demo@example.com" },
      update: {},
      create: {
        id: demoUserId,
        email: "demo@example.com",
        passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // demo123
        name: "Demo User",
      },
    });
    
    const campaign = await prisma.campaign.create({
      data: {
        name,
        status: status as "draft" | "active" | "paused" | "completed",
        ownerId: user.id,
      },
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
    console.error("Error creating campaign:", error);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}