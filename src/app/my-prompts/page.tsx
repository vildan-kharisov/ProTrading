/**
 * Мои промты: список Tradeidea текущего пользователя.
 * Приватные промты видит только владелец (фильтр по userId).
 */
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function MyPromptsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Все промты пользователя (приватные видит только владелец)
  const tradeideas = await prisma.tradeidea.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
    include: {
      category: true,
    },
  });

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Мои промты
          </h1>
          <Link
            href="/dashboard"
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            В кабинет
          </Link>
        </div>

        {tradeideas.length === 0 ? (
          <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-950">
            <p className="text-zinc-600 dark:text-zinc-400">
              У вас пока нет промтов. Создайте первый в личном кабинете или через API.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {tradeideas.map((ti) => (
              <li
                key={ti.id}
                className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-medium text-zinc-900 dark:text-zinc-50">
                      {ti.title}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {ti.category.category} · {ti.visibility}
                    </p>
                    {ti.description && (
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {ti.description}
                      </p>
                    )}
                  </div>
                  <span className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800">
                    {ti.visibility}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
