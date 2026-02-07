/**
 * Боковая панель Личного кабинета.
 * Показывает аватар, имя пользователя и навигацию.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Star,
  History,
  Settings,
  Globe,
} from "lucide-react";

interface DashboardSidebarProps {
  userName: string;
  userImage?: string | null;
}

const menuItems = [
  { href: "/dashboard", label: "Промты", icon: MessageSquare },
  { href: "/dashboard/public", label: "Публичные", icon: Globe },
  { href: "/dashboard/favorites", label: "Избранное", icon: Star },
  { href: "/dashboard/history", label: "История", icon: History },
  { href: "/dashboard/settings", label: "Настройки", icon: Settings },
];

export function DashboardSidebar({ userName, userImage }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-[280px] shrink-0 flex-col bg-gradient-to-b from-sky-50 via-blue-50 to-indigo-50 p-6">
      {/* Аватар и имя */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-200 text-blue-700 font-semibold text-lg">
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            userName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">{userName}</p>
          <p className="text-xs text-slate-500">Личный кабинет</p>
        </div>
      </div>

      {/* Навигация */}
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/80 text-blue-700 shadow-sm"
                  : "text-slate-600 hover:bg-white/50 hover:text-slate-800"
              }`}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Ссылка на главную внизу */}
      <div className="mt-auto pt-6">
        <Link
          href="/"
          className="block rounded-lg px-3 py-2 text-center text-xs font-medium text-slate-500 hover:bg-white/50 hover:text-slate-700 transition-colors"
        >
          ← На главную
        </Link>
      </div>
    </aside>
  );
}
