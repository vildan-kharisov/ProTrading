/**
 * Личный кабинет: доступен только авторизованным пользователям.
 * Пример server-side проверки сессии.
 */
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;
  const userName = session.user.name ?? session.user.email ?? "Пользователь";

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Личный кабинет
          </h1>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Вернуться на главную
            </Link>
            <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Выйти
            </button>
          </form>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-950">
          <p className="mb-2 text-zinc-600 dark:text-zinc-400">
            Вы вошли как <strong className="text-zinc-900 dark:text-zinc-50">{userName}</strong>
          </p>
          <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-500">
            userId (стабильный): <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">{userId}</code>
          </p>
          <nav className="flex flex-col gap-2">
            <Link
              href="/my-prompts"
              className="rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white hover:bg-blue-700"
            >
              Мои промты
            </Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
