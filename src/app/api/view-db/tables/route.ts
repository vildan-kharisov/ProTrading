import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient, PRISMA_MODELS } from "@/lib/prisma-factory";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dbType = (searchParams.get("db") || "remote") as "local" | "remote";

    // Просто возвращаем список всех моделей из Prisma схемы
    // Проверку подключения делаем при открытии конкретной таблицы
    return NextResponse.json({
      tables: PRISMA_MODELS.map((model) => ({
        name: model,
        displayName: model,
      })),
      dbType,
    });
  } catch (error: any) {
    console.error("Ошибка при получении списка таблиц:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка при получении списка таблиц" },
      { status: 500 }
    );
  }
}
