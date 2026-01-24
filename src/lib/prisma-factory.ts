import "dotenv/config";
import { PrismaClient } from "../generated/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

export type DbType = "local" | "remote";

// Кэш для Prisma клиентов
const prismaClients: Map<DbType, PrismaClient> = new Map();

export function getPrismaClient(dbType: DbType = "remote"): PrismaClient {
  // Возвращаем существующий клиент, если он есть
  if (prismaClients.has(dbType)) {
    return prismaClients.get(dbType)!;
  }

  let databaseUrl: string;

  if (dbType === "local") {
    databaseUrl = process.env.DATABASE_URL_LOCAL || process.env.DATABASE_URL || "";
  } else {
    databaseUrl = process.env.DATABASE_URL || "";
  }

  if (!databaseUrl) {
    throw new Error(
      `DATABASE_URL не установлена для ${dbType === "local" ? "локальной" : "рабочей"} БД.`
    );
  }

  const pool = new pg.Pool({
    connectionString: databaseUrl,
  });

  const adapter = new PrismaPg(pool);

  const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  // Сохраняем клиент в кэш
  prismaClients.set(dbType, prisma);

  return prisma;
}

// Получаем список всех моделей из Prisma схемы
export const PRISMA_MODELS = [
  "User",
  "Note",
  "Category",
  "Tradeidea",
  "Vote",
  "Tag",
  "TagOnTradeidea",
] as const;

export type PrismaModel = (typeof PRISMA_MODELS)[number];

// Маппинг имен моделей для Prisma Client (в нижнем регистре)
export const MODEL_NAME_MAP: Record<PrismaModel, string> = {
  User: "user",
  Note: "note",
  Category: "category",
  Tradeidea: "tradeidea",
  Vote: "vote",
  Tag: "tag",
  TagOnTradeidea: "tagOnTradeidea",
};
