"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ViewDbPage() {
  const router = useRouter();
  const [dbType, setDbType] = useState<"local" | "remote">("remote");

  const handleSelect = () => {
    router.push(`/view-db/tables?db=${dbType}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm dark:bg-zinc-950">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Просмотр базы данных
        </h1>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Выберите базу данных:
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="dbType"
                  value="remote"
                  checked={dbType === "remote"}
                  onChange={(e) => setDbType(e.target.value as "local" | "remote")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-zinc-900 dark:text-zinc-50">Рабочая БД</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="dbType"
                  value="local"
                  checked={dbType === "local"}
                  onChange={(e) => setDbType(e.target.value as "local" | "remote")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-zinc-900 dark:text-zinc-50">Локальная БД</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleSelect}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
          >
            Продолжить
          </button>
        </div>
      </div>
    </main>
  );
}
