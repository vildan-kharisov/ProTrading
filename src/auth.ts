/**
 * Auth.js (NextAuth v5) — полная конфигурация с Prisma-адаптером.
 * Используется в API routes и для создания пользователей в БД.
 * Middleware импортирует auth из auth.config.ts (без Prisma).
 */
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  events: {
    async createUser({ user }) {
      console.log("[Auth] Новый пользователь создан:", user.email);
    },
  },
  debug: process.env.NODE_ENV === "development",
});
