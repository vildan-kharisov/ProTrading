/**
 * Конфиг Auth.js без Prisma — для middleware (Edge Runtime).
 * Middleware не может использовать Prisma, поэтому auth() импортируется отсюда.
 */
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true, // для Vercel и локальной разработки
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET ?? "",
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    // Разрешаем редирект на /dashboard после входа
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;
