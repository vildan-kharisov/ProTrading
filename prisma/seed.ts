import "dotenv/config";
import { PrismaClient } from "../src/generated/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env");
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.note.count();

  if (count === 0) {
    // Создаём системного пользователя для seed-заметок (Note требует ownerId)
    const systemUser = await prisma.user.upsert({
      where: { email: "system@seed.local" },
      update: {},
      create: {
        email: "system@seed.local",
        name: "Система (seed)",
      },
    });

    await prisma.note.createMany({
      data: [
        { title: "Первая заметка из seed-скрипта", ownerId: systemUser.id },
        { title: "Вторая заметка, загруженная из PostgreSQL", ownerId: systemUser.id },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

