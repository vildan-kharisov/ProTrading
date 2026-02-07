/**
 * Страница «Настройки» — заглушка.
 */
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900">Личный кабинет</h1>
      <h2 className="mt-1 text-lg text-slate-500">Настройки</h2>

      <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-20 px-6 text-center">
        <Settings className="mb-3 h-10 w-10 text-slate-300" />
        <p className="text-sm font-medium text-slate-500">
          Раздел «Настройки» появится скоро…
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Здесь можно будет менять профиль, тему и другие параметры.
        </p>
      </div>
    </div>
  );
}
