/**
 * Middleware: защита страниц /dashboard и /my-prompts.
 * Неавторизованных пользователей редиректим на /login.
 * Импортируем auth из auth.config.ts (без Prisma), т.к. middleware работает в Edge Runtime.
 */
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;

  const protectedPaths = ["/dashboard", "/my-prompts"];
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", path);
    return Response.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/my-prompts/:path*",
  ],
};
