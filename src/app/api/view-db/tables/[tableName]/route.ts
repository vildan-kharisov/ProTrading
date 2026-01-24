import { NextRequest, NextResponse } from "next/server";
import {
  getPrismaClient,
  PRISMA_MODELS,
  PrismaModel,
  MODEL_NAME_MAP,
} from "@/lib/prisma-factory";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tableName: string }> | { tableName: string } }
) {
  try {
    // В Next.js 15+ params может быть Promise, нужно await
    const resolvedParams = await Promise.resolve(params);
    const tableName = resolvedParams.tableName as PrismaModel;
    
    const searchParams = request.nextUrl.searchParams;
    const dbType = (searchParams.get("db") || "remote") as "local" | "remote";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const skip = (page - 1) * pageSize;
    
    console.log(`[view-db] Запрос данных для таблицы: ${tableName}, БД: ${dbType}, страница: ${page}`);

    if (!PRISMA_MODELS.includes(tableName)) {
      return NextResponse.json({ error: "Таблица не найдена" }, { status: 404 });
    }

    let prisma;
    try {
      prisma = getPrismaClient(dbType);
    } catch (dbError: any) {
      console.error("Ошибка создания Prisma клиента:", dbError);
      const dbTypeName = dbType === "local" ? "локальной" : "рабочей";
      const envVar = dbType === "local" ? "DATABASE_URL_LOCAL" : "DATABASE_URL";
      const errorMessage = dbError.message || `Проверьте настройки ${envVar} в файле .env`;
      return NextResponse.json(
        {
          error: `Ошибка подключения к ${dbTypeName} БД: ${errorMessage}`,
        },
        { status: 500 }
      );
    }

    // Динамически получаем данные из таблицы
    const modelName = MODEL_NAME_MAP[tableName];
    console.log(`[view-db] Имя модели Prisma: ${modelName}`);
    const model = (prisma as any)[modelName];
    if (!model) {
      console.error(`[view-db] Модель ${modelName} не найдена в Prisma клиенте`);
      return NextResponse.json({ error: `Модель ${modelName} не найдена` }, { status: 404 });
    }

    let total, data;
    try {
      // Получаем общее количество записей
      total = await model.count();

      // Получаем данные с пагинацией
      // Для таблиц с составным ключом используем другой orderBy
      let orderBy: any;
      if (tableName === "TagOnTradeidea") {
        orderBy = { tradeideaId: "asc" };
      } else {
        orderBy = { id: "asc" };
      }

      data = await model.findMany({
        skip,
        take: pageSize,
        orderBy,
      });
    } catch (queryError: any) {
      console.error("Ошибка при выполнении запроса к БД:", queryError);
      const dbTypeName = dbType === "local" ? "локальной" : "рабочей";
      const errorMsg = queryError.message || "Возможно, таблица не существует или БД недоступна";
      try {
        await prisma.$disconnect();
      } catch (e) {
        // Игнорируем ошибки при закрытии
      }
      return NextResponse.json(
        {
          error: `Ошибка при получении данных из ${dbTypeName} БД: ${errorMsg}`,
        },
        { status: 500 }
      );
    }

    // Для таблиц с составным ключом добавляем виртуальный id
    const processedData = data.map((row: any) => {
      if (tableName === "TagOnTradeidea" && !row.id) {
        return { ...row, id: `${row.tradeideaId}_${row.tagId}` };
      }
      return row;
    });

    console.log(`[view-db] Успешно получено ${processedData.length} записей из ${tableName}, всего: ${total}`);
    
    return NextResponse.json({
      data: processedData,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error: any) {
    console.error("Ошибка при получении данных таблицы:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка при получении данных таблицы" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tableName: string }> | { tableName: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const tableName = resolvedParams.tableName as PrismaModel;
    
    const searchParams = request.nextUrl.searchParams;
    const dbType = (searchParams.get("db") || "remote") as "local" | "remote";

    if (!PRISMA_MODELS.includes(tableName)) {
      return NextResponse.json({ error: "Таблица не найдена" }, { status: 404 });
    }

    const body = await request.json();
    const prisma = getPrismaClient(dbType);

    const modelName = MODEL_NAME_MAP[tableName];
    const model = (prisma as any)[modelName];
    if (!model) {
      return NextResponse.json({ error: "Модель не найдена" }, { status: 404 });
    }

    const created = await model.create({
      data: body,
    });

    return NextResponse.json({ data: created });
  } catch (error: any) {
    console.error("Ошибка при создании записи:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка при создании записи" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tableName: string }> | { tableName: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const tableName = resolvedParams.tableName as PrismaModel;
    
    const searchParams = request.nextUrl.searchParams;
    const dbType = (searchParams.get("db") || "remote") as "local" | "remote";

    if (!PRISMA_MODELS.includes(tableName)) {
      return NextResponse.json({ error: "Таблица не найдена" }, { status: 404 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID обязателен для обновления" }, { status: 400 });
    }

    const prisma = getPrismaClient(dbType);
    const modelName = MODEL_NAME_MAP[tableName];
    const model = (prisma as any)[modelName];
    if (!model) {
      return NextResponse.json({ error: "Модель не найдена" }, { status: 404 });
    }

    // Для составных ключей (TagOnTradeidea) используем другой where
    let whereClause: any;
    if (tableName === "TagOnTradeidea") {
      const [tradeideaId, tagId] = id.split("_");
      // Для составных ключей используем оба поля
      whereClause = {
        tradeideaId: tradeideaId || updateData.tradeideaId,
        tagId: tagId || updateData.tagId,
      };
    } else {
      whereClause = { id };
    }

    const updated = await model.update({
      where: whereClause,
      data: updateData,
    });

    return NextResponse.json({ data: updated });
  } catch (error: any) {
    console.error("Ошибка при обновлении записи:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка при обновлении записи" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tableName: string }> | { tableName: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const tableName = resolvedParams.tableName as PrismaModel;
    
    const searchParams = request.nextUrl.searchParams;
    const dbType = (searchParams.get("db") || "remote") as "local" | "remote";
    const id = searchParams.get("id");

    if (!PRISMA_MODELS.includes(tableName)) {
      return NextResponse.json({ error: "Таблица не найдена" }, { status: 404 });
    }

    if (!id) {
      return NextResponse.json({ error: "ID обязателен для удаления" }, { status: 400 });
    }

    const prisma = getPrismaClient(dbType);
    const modelName = MODEL_NAME_MAP[tableName];
    const model = (prisma as any)[modelName];
    if (!model) {
      return NextResponse.json({ error: "Модель не найдена" }, { status: 404 });
    }

    // Для составных ключей (TagOnTradeidea) используем другой where
    let whereClause: any;
    if (tableName === "TagOnTradeidea") {
      const [tradeideaId, tagId] = id.split("_");
      // Для составных ключей используем оба поля
      whereClause = {
        tradeideaId,
        tagId,
      };
    } else {
      whereClause = { id };
    }

    await model.delete({
      where: whereClause,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Ошибка при удалении записи:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка при удалении записи" },
      { status: 500 }
    );
  }
}
