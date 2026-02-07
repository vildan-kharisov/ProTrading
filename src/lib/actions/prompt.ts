/**
 * Server Actions для CRUD-операций с промтами.
 * Все действия проверяют авторизацию и права владельца.
 */
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  createPromptSchema,
  updatePromptSchema,
  deletePromptSchema,
  togglePromptSchema,
} from "@/lib/validations/prompt";

// Тип результата для единообразного ответа
type ActionResult = {
  success: boolean;
  error?: string;
};

/** Получить userId из сессии или вернуть ошибку */
async function getUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

/** Создание нового промта */
export async function createPrompt(formData: FormData): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "Не авторизован" };

  const raw = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    isPublic: formData.get("isPublic") === "true",
  };

  const parsed = createPromptSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Ошибка валидации" };
  }

  await prisma.prompt.create({
    data: {
      userId,
      title: parsed.data.title,
      content: parsed.data.content,
      isPublic: parsed.data.isPublic,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

/** Обновление промта (только владелец) */
export async function updatePrompt(formData: FormData): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "Не авторизован" };

  const raw = {
    id: formData.get("id") as string,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    isPublic: formData.get("isPublic") === "true",
  };

  const parsed = updatePromptSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Ошибка валидации" };
  }

  // Проверка прав: только владелец может редактировать
  const existing = await prisma.prompt.findUnique({ where: { id: parsed.data.id } });
  if (!existing || existing.userId !== userId) {
    return { success: false, error: "Промт не найден или нет доступа" };
  }

  await prisma.prompt.update({
    where: { id: parsed.data.id },
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      isPublic: parsed.data.isPublic,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

/** Удаление промта (только владелец) */
export async function deletePrompt(formData: FormData): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "Не авторизован" };

  const raw = { id: formData.get("id") as string };
  const parsed = deletePromptSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Ошибка валидации" };
  }

  // Проверка прав: только владелец может удалять
  const existing = await prisma.prompt.findUnique({ where: { id: parsed.data.id } });
  if (!existing || existing.userId !== userId) {
    return { success: false, error: "Промт не найден или нет доступа" };
  }

  await prisma.prompt.delete({ where: { id: parsed.data.id } });

  revalidatePath("/dashboard");
  return { success: true };
}

/** Переключение публичности промта (только владелец) */
export async function togglePublic(formData: FormData): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "Не авторизован" };

  const raw = { id: formData.get("id") as string };
  const parsed = togglePromptSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Ошибка валидации" };
  }

  // Проверка прав: только владелец может менять видимость
  const existing = await prisma.prompt.findUnique({ where: { id: parsed.data.id } });
  if (!existing || existing.userId !== userId) {
    return { success: false, error: "Промт не найден или нет доступа" };
  }

  await prisma.prompt.update({
    where: { id: parsed.data.id },
    data: { isPublic: !existing.isPublic },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

/** Переключение избранного (только владелец) */
export async function toggleFavorite(formData: FormData): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "Не авторизован" };

  const raw = { id: formData.get("id") as string };
  const parsed = togglePromptSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Ошибка валидации" };
  }

  // Проверка прав: только владелец может переключать избранное
  const existing = await prisma.prompt.findUnique({ where: { id: parsed.data.id } });
  if (!existing || existing.userId !== userId) {
    return { success: false, error: "Промт не найден или нет доступа" };
  }

  await prisma.prompt.update({
    where: { id: parsed.data.id },
    data: { isFavorite: !existing.isFavorite },
  });

  revalidatePath("/dashboard");
  return { success: true };
}
