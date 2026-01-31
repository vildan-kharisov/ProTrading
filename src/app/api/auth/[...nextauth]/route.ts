/**
 * Маршрут Auth.js: обработка всех запросов аутентификации
 * (callback Google, сессии и т.д.)
 */
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
