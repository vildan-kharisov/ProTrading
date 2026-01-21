// Загружаем переменные окружения явно для серверных компонентов Next.js
import "dotenv/config";
import { PrismaClient } from "../generated/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Получаем DATABASE_URL из переменных окружения
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL не установлена. Убедитесь, что файл .env существует в корне проекта и содержит DATABASE_URL."
  );
}

// Создаем пул подключений PostgreSQL
// NeonDB совместим с PostgreSQL протоколом, поэтому используем стандартный pg.Pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Создаем адаптер Prisma для PostgreSQL
const adapter = new PrismaPg(pool);

// Создаем Prisma Client с адаптером
// Используем singleton паттерн для избежания множественных подключений при hot reload
export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

