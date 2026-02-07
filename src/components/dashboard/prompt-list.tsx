/**
 * Список карточек промтов с пагинацией.
 * Серверный компонент — данные приходят извне.
 */
import { PromptCard, type PromptData } from "./prompt-card";
import { Pagination } from "./pagination";

interface PromptListProps {
  prompts: PromptData[];
  currentUserId: string;
  /** Показывать ли кнопки владельца */
  showOwnerActions?: boolean;
  /** Текст для пустого состояния */
  emptyText?: string;
  /** Текущая страница (для пагинации) */
  page: number;
  /** Общее количество записей */
  totalCount: number;
  /** Записей на странице */
  pageSize: number;
}

export function PromptList({
  prompts,
  currentUserId,
  showOwnerActions = true,
  emptyText = "У вас пока нет промтов — создайте первый!",
  page,
  totalCount,
  pageSize,
}: PromptListProps) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-16 px-6 text-center">
        <p className="text-sm text-slate-500">{emptyText}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-3">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          currentUserId={currentUserId}
          showOwnerActions={showOwnerActions}
        />
      ))}

      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}
