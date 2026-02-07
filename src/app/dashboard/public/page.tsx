/**
 * Страница «Публичные промты».
 * Показывает все промты с isPublic = true.
 * Владелец видит кнопки edit/delete, остальные — только чтение.
 */
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PromptList } from "@/components/dashboard/prompt-list";
import { SearchInput } from "@/components/dashboard/search-input";

const PAGE_SIZE = 10;

interface PublicPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function PublicPromptsPage({ searchParams }: PublicPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const params = await searchParams;
  const query = params.q ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);

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

  const [prompts, totalCount] = await Promise.all([
    prisma.prompt.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.prompt.count({ where }),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900">Личный кабинет</h1>
      <h2 className="mt-1 text-lg text-slate-500">Публичные промты</h2>

      <div className="mt-6">
        <SearchInput />
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
