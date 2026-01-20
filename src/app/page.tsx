import { prisma } from "../lib/prisma";

export default async function Home() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-950">
        <h1 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Notes from PostgreSQL (Neon) via Prisma
        </h1>

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
    </main>
  );
}
