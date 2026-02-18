/**
 * Глобальный Header приложения.
 * Лого, навигация, аватар/имя/кнопка входа.
 */
import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/sign-out-button";
import { Sparkles } from "lucide-react";

export async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Лого */}
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 text-lg">
          <Sparkles className="h-5 w-5 text-blue-600" />
          ProStore
        </Link>

        {/* Навигация */}
        <nav className="hidden items-center gap-6 sm:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Главная
          </Link>
          <Link
            href="/dashboard/public"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Каталог
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Мои промты
            </Link>
          )}
        </nav>

        {/* Профиль / Вход */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name ?? ""}
                    className="h-7 w-7 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                    {(user.name ?? user.email ?? "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden text-sm font-medium text-slate-700 sm:inline">
                  {user.name ?? user.email}
                </span>
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
