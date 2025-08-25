import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@nasa.com" },
    update: {},
    create: {
      email: "admin@nasa.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Missions
  await prisma.mission.createMany({
    data: [
      {
        title: "Apollo 11",
        description: "First manned mission to land on the Moon.",
        launchDate: new Date("1969-07-16"),
        status: "Completed",
        imageUrl: "https://example.com/apollo11.jpg",
        createdBy: admin.id,
      },
      {
        title: "Mars Rover",
        description: "Exploration of Mars surface with rovers.",
        launchDate: new Date("2021-02-18"),
        status: "Active",
        imageUrl: "https://example.com/mars.jpg",
        createdBy: admin.id,
      },
    ],
    skipDuplicates: true,
  });

  // Projects
  await prisma.project.createMany({
    data: [
      {
        title: "James Webb Telescope",
        description: "Next-gen space telescope.",
        startDate: new Date("2021-12-25"),
        status: "Active",
        imageUrl: "https://example.com/jameswebb.jpg",
        createdBy: admin.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
