/**
 * Глобальный Footer приложения.
 */
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Sparkles className="h-4 w-4 text-blue-500" />
          <span>&copy; {year} ProStore. Все права защищены.</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="#"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Политика конфиденциальности
          </Link>
          <Link
            href="#"
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Контакты
          </Link>
        </nav>
      </div>
    </footer>
  );
}
