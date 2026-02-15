/**
 * Переключатель сортировки: Популярные / Новые.
 * Управляет URL-параметром ?sort=popular|recent.
 */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Flame, Clock } from "lucide-react";

const SORT_OPTIONS = [
  { value: "popular", label: "Популярные", icon: Flame },
  { value: "recent", label: "Новые", icon: Clock },
] as const;

export function SortToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "recent";

  function setSort(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.delete("page"); // Сбрасываем страницу при смене сортировки
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
      {SORT_OPTIONS.map(({ value, label, icon: Icon }) => {
        const isActive = currentSort === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setSort(value)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
