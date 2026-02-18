/**
 * Главная страница ProStore.
 * Hero-блок + два раздела: «Новые» и «Популярные» публичные промты.
 * Гость видит карточки без кнопок редактирования.
 */
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PublicPromptCard, type PublicPrompt } from "@/components/public-prompt-card";
import { Sparkles, ArrowRight, Clock, Flame } from "lucide-react";

const SECTION_SIZE = 12;

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  // Два параллельных запроса: новые и популярные
  const [recentRaw, popularRaw] = await Promise.all([
    prisma.prompt.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
      take: SECTION_SIZE,
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { likes: true } },
      },
    }),
    prisma.prompt.findMany({
      where: { isPublic: true },
      orderBy: { likes: { _count: "desc" } },
      take: SECTION_SIZE,
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { likes: true } },
      },
    }),
  ]);

  // Собираем все уникальные promptId для запроса likedByMe
  const allIds = [...new Set([...recentRaw, ...popularRaw].map((p) => p.id))];

  let likedSet = new Set<string>();
  if (userId && allIds.length > 0) {
    const userLikes = await prisma.promptLike.findMany({
      where: { userId, promptId: { in: allIds } },
      select: { promptId: true },
    });
    likedSet = new Set(userLikes.map((l) => l.promptId));
  }

  function toPublicPrompt(
    p: (typeof recentRaw)[number]
  ): PublicPrompt {
    return {
      id: p.id,
      title: p.title,
      content: p.content,
      createdAt: p.createdAt,
      authorName: p.user.name ?? p.user.email ?? "Аноним",
      likesCount: p._count.likes,
      likedByMe: likedSet.has(p.id),
    };
  }

  const recentPrompts = recentRaw.map(toPublicPrompt);
  const popularPrompts = popularRaw.map(toPublicPrompt);
  const isAuthenticated = !!userId;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            <Sparkles className="h-4 w-4" />
            Каталог промтов
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Создавайте, храните и делитесь лучшими промтами
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            ProStore — платформа для обмена промтами. Находите полезные шаблоны, сохраняйте свои и вдохновляйтесь работами сообщества.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                Добавить промт
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                title="Войдите, чтобы добавлять промты"
              >
                Войти и добавить промт
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <Link
              href="/dashboard/public"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              Смотреть каталог
            </Link>
          </div>
          {!isAuthenticated && (
            <p className="mt-3 text-xs text-slate-400">
              Войдите, чтобы создавать и редактировать промты
            </p>
          )}
        </div>
      </section>

      {/* Новые промты */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-400" />
            <h2 className="text-xl font-bold text-slate-900">Новые промты</h2>
          </div>

          {recentPrompts.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              Публичных промтов пока нет. Станьте первым!
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentPrompts.map((p) => (
                <PublicPromptCard
                  key={p.id}
                  prompt={p}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Популярные промты */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-6 flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-400" />
            <h2 className="text-xl font-bold text-slate-900">Популярные промты</h2>
          </div>

          {popularPrompts.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              Пока нет промтов с лайками.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularPrompts.map((p) => (
                <PublicPromptCard
                  key={p.id}
                  prompt={p}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
