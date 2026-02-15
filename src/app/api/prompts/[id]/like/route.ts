/**
 * POST /api/prompts/[id]/like
 * Toggle-лайк на публичный промт.
 *
 * Логика:
 * - Проверяем авторизацию.
 * - Проверяем, что промт существует и isPublic = true.
 * - Если лайк уже есть — удаляем (unlike), иначе — создаём (like).
 * - Возвращаем { liked: boolean, likesCount: number }.
 */
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Проверка авторизации
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Необходимо войти в аккаунт" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { id: promptId } = await params;

    // Проверяем, что промт существует и публичный
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
      select: { id: true, isPublic: true },
    });

    if (!prompt) {
      return NextResponse.json(
        { error: "Промт не найден" },
        { status: 404 }
      );
    }

    if (!prompt.isPublic) {
      return NextResponse.json(
        { error: "Лайкать можно только публичные промты" },
        { status: 403 }
      );
    }

    // Toggle: проверяем, есть ли уже лайк от этого пользователя
    const existingLike = await prisma.promptLike.findUnique({
      where: {
        userId_promptId: { userId, promptId },
      },
    });

    let liked: boolean;

    if (existingLike) {
      // Удаляем лайк (unlike)
      await prisma.promptLike.delete({
        where: { id: existingLike.id },
      });
      liked = false;
    } else {
      // Ставим лайк
      await prisma.promptLike.create({
        data: { userId, promptId },
      });
      liked = true;
    }

    // Считаем актуальное количество лайков
    const likesCount = await prisma.promptLike.count({
      where: { promptId },
    });

    return NextResponse.json({ liked, likesCount });
  } catch (error) {
    console.error("[Like API] Ошибка:", error);
    return NextResponse.json(
      { error: "Попробуйте позже" },
      { status: 500 }
    );
  }
}
