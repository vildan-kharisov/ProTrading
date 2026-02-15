/**
 * Страница «Публичные промты».
 * Показывает все промты с isPublic = true.
 * Поддерживает лайки, сортировку (popular/recent), поиск, пагинацию.
 * Владелец видит кнопки edit/delete, остальные — только чтение.
 */
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PromptList } from "@/components/dashboard/prompt-list";
import { SearchInput } from "@/components/dashboard/search-input";
import { SortToggle } from "@/components/dashboard/sort-toggle";

const PAGE_SIZE = 10;

interface PublicPageProps {
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>;
}

export default async function PublicPromptsPage({ searchParams }: PublicPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const params = await searchParams;
  const query = params.q ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const sort = params.sort === "popular" ? "popular" : "recent";

  const where = {
    isPublic: true,
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { content: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  // Сортировка: по популярности (кол-во лайков) или по дате
  const orderBy =
    sort === "popular"
      ? { likes: { _count: "desc" as const } }
      : { createdAt: "desc" as const };

  const [rawPrompts, totalCount] = await Promise.all([
    prisma.prompt.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        _count: { select: { likes: true } },
      },
    }),
    prisma.prompt.count({ where }),
  ]);

  // Получаем id промтов, которые лайкнул текущий пользователь (один запрос)
  const promptIds = rawPrompts.map((p) => p.id);
  const userLikes = await prisma.promptLike.findMany({
    where: {
      userId,
      promptId: { in: promptIds },
    },
    select: { promptId: true },
  });
  const likedSet = new Set(userLikes.map((l) => l.promptId));

  // Формируем данные для компонента с полями likesCount и likedByMe
  const prompts = rawPrompts.map((p) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    isPublic: p.isPublic,
    isFavorite: p.isFavorite,
    userId: p.userId,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    likesCount: p._count.likes,
    likedByMe: likedSet.has(p.id),
  }));

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900">Личный кабинет</h1>
      <h2 className="mt-1 text-lg text-slate-500">Публичные промты</h2>

      {/* Панель: поиск + сортировка */}
      <div className="mt-6 flex items-center gap-4">
        <div className="flex-1">
          <SearchInput />
        </div>
        <SortToggle />
      </div>

      <div className="mt-6">
        <PromptList
          prompts={prompts}
          currentUserId={userId}
          showOwnerActions
          emptyText={
            query
              ? `По запросу «${query}» ничего не найдено`
              : "Публичных промтов пока нет"
          }
          page={page}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  );
}
