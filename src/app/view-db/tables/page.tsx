"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

interface Table {
  name: string;
  displayName: string;
}

function TablesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dbType = searchParams.get("db") || "remote";
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/view-db/tables?db=${dbType}`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || "Ошибка при загрузке таблиц");
          });
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setTables(data.tables);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Ошибка при загрузке таблиц");
        setLoading(false);
        console.error(err);
      });
  }, [dbType]);

  const handleOpenTable = (tableName: string) => {
    router.push(`/view-db/tables/${tableName}?db=${dbType}`);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
        <div className="text-zinc-600 dark:text-zinc-400">Загрузка...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
        <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-950">
          <div className="mb-4 text-red-600 dark:text-red-400">{error}</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            {dbType === "local" 
              ? "Убедитесь, что переменная DATABASE_URL_LOCAL установлена в файле .env и указывает на локальную базу данных."
              : "Убедитесь, что переменная DATABASE_URL установлена в файле .env и указывает на рабочую базу данных."}
          </div>
          <button
            onClick={() => router.push("/view-db")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Вернуться к выбору БД
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Таблицы базы данных
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {dbType === "local" ? "Локальная БД" : "Рабочая БД"}
            </p>
          </div>
          <button
            onClick={() => router.push("/view-db")}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Назад
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tables.map((table) => (
            <div
              key={table.name}
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <h3 className="mb-2 font-medium text-zinc-900 dark:text-zinc-50">
                {table.displayName}
              </h3>
              <button
                onClick={() => handleOpenTable(table.name)}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
              >
                Открыть
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function TablesPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
          <div className="text-zinc-600 dark:text-zinc-400">Загрузка...</div>
        </main>
      }
    >
      <TablesContent />
    </Suspense>
  );
}
