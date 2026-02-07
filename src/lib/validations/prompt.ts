/**
 * Zod-схемы валидации для сущности Prompt.
 * Используются в server actions для проверки входных данных.
 */
import { z } from "zod";

export const createPromptSchema = z.object({
  title: z
    .string()
    .min(1, "Заголовок обязателен")
    .max(200, "Заголовок не может быть длиннее 200 символов"),
  content: z
    .string()
    .min(1, "Содержимое обязательно")
    .max(10000, "Содержимое не может быть длиннее 10 000 символов"),
  isPublic: z.boolean().default(false),
});

export const updatePromptSchema = z.object({
  id: z.string().min(1, "ID обязателен"),
  title: z
    .string()
    .min(1, "Заголовок обязателен")
    .max(200, "Заголовок не может быть длиннее 200 символов"),
  content: z
    .string()
    .min(1, "Содержимое обязательно")
    .max(10000, "Содержимое не может быть длиннее 10 000 символов"),
  isPublic: z.boolean(),
});

export const deletePromptSchema = z.object({
  id: z.string().min(1, "ID обязателен"),
});

export const togglePromptSchema = z.object({
  id: z.string().min(1, "ID обязателен"),
});

export type CreatePromptInput = z.infer<typeof createPromptSchema>;
export type UpdatePromptInput = z.infer<typeof updatePromptSchema>;
