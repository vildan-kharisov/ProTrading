import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "../lib/prisma";
import { SignOutButton } from "@/components/sign-out-button";

export default async function Home() {
  const session = await auth();
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
      {/* Шапка с авторизацией */}
      <header className="mx-auto mb-8 flex w-full max-w-2xl items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          ProStore
        </h1>
        <nav className="flex items-center gap-3">
          {session?.user ? (
            <>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {session.user.name ?? session.user.email}
              </span>
              <Link
                href="/dashboard"
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Личный кабинет
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Войти
            </Link>
          )}
        </nav>
      </header>

      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-950">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Notes from PostgreSQL (Neon) via Prisma
          </h2>

          {notes.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            В базе пока нет заметок. Запусти seed-скрипт, чтобы создать пример данных.
          </p>
        ) : (
          <ul className="space-y-3">
            {notes.map((note) => (
              <li
                key={note.id}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              >
                <div className="font-medium">{note.title}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(note.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
          )}
        </div>
      </div>
    </main>
  );
}
