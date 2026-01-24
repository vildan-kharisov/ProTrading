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
  console.log("🔍 Начинаю проверку базы данных...\n");

  // Создаем или находим категорию
  let category = await prisma.category.findFirst({
    where: { category: "Тестовая категория" },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        category: "Тестовая категория",
      },
    });
    console.log("✅ Создана категория:", category.category);
  } else {
    console.log("✅ Найдена категория:", category.category);
  }

  // Создаем тестового пользователя
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Тестовый пользователь",
    },
  });
  console.log("✅ Создан/найден пользователь:", user.email, `(${user.name})`);

  // Создаем тестовый Tradeidea (промт)
  const tradeidea = await prisma.tradeidea.create({
    data: {
      title: "Тестовый Tradeidea",
      content: "Это тестовое содержимое Tradeidea для проверки базы данных.",
      description: "Описание тестового Tradeidea",
      ownerId: user.id,
      categoryId: category.id,
      visibility: "PUBLIC",
    },
  });
  console.log("✅ Создан Tradeidea:", tradeidea.title, `(ID: ${tradeidea.id})`);

  // Создаем голос за Tradeidea
  const vote = await prisma.vote.create({
    data: {
      userId: user.id,
      tradeideaId: tradeidea.id,
      value: 1,
    },
  });
  console.log("✅ Создан голос:", `Пользователь ${user.email} проголосовал за Tradeidea "${tradeidea.title}"`);

  // Проверяем созданные данные
  console.log("\n📊 Проверка созданных данных:");
  const userWithRelations = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      tradeideas: true,
      votes: {
        include: {
          tradeidea: true,
        },
      },
    },
  });

  if (userWithRelations) {
    console.log(`   - Пользователь имеет ${userWithRelations.tradeideas.length} Tradeidea`);
    console.log(`   - Пользователь имеет ${userWithRelations.votes.length} голосов`);
  }

  console.log("\n✅ Проверка завершена успешно!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Ошибка при проверке:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
