import { prisma } from "../lib/prisma";

const campaignNames = [
  "Just Herbs",
  "Juicy chemistry",
  "Hyugalife 2",
  "Honeyveda",
  "HempStreet",
  "HealthyHey 2",
  "Herbal Chakra",
  "Healofy",
  "HealthSense",
];

const firstNames = [
  "Om",
  "Surdeep",
  "Dilibag",
  "Vanshy",
  "Sunil",
  "Utkarsh",
  "Shreya",
  "Deepak",
  "Diego",
  "Priya",
  "Ankit",
];
const lastNames = ["Satyarthy", "Singh", "Jain", "Pal", "K.", "Ramakrishna", "Kumar", "Rao", "Patel"];
const companies = ["Gynoveda", "Digi Sidekick", "The skin story", "Pokonut", "Re'equil", "Openpanda"];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const owner = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      id: "demo-user-id",
      email: "demo@example.com",
      passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // demo123
      name: "Demo User",
    },
  });

  // campaigns
  const campaigns = await Promise.all(
    campaignNames.map((name) =>
      prisma.campaign.upsert({
        where: { name_ownerId: { name, ownerId: owner.id } },
        update: {},
        create: {
          name,
          status: Math.random() > 0.7 ? "paused" : "active",
          ownerId: owner.id,
        },
      })
    )
  );

  // leads per campaign
  for (const c of campaigns) {
    const count = 12 + Math.floor(Math.random() * 12);
    for (let i = 0; i < count; i++) {
      const name = `${pick(firstNames)} ${pick(lastNames)}`;
      const email = `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`;
      const company = pick(companies);
      const statuses = ["pending", "contacted", "responded", "converted"] as const;
      const status = pick(statuses) as "pending" | "contacted" | "responded" | "converted";
      const daysAgo = 1 + Math.floor(Math.random() * 30);
      const lastContactDate = new Date();
      lastContactDate.setDate(lastContactDate.getDate() - daysAgo);

      await prisma.lead.create({
        data: {
          name,
          email,
          company,
          status,
          lastContactDate,
          campaignId: c.id,
          ownerId: owner.id,
        },
      });
    }
  }

  console.log("Seed completed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


