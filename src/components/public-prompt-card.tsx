/**
 * Карточка публичного промта для главной страницы.
 * Только чтение: заголовок, автор, дата, счётчик лайков.
 * Никаких кнопок редактирования/удаления.
 */
import { MessageSquare, User as UserIcon, Calendar } from "lucide-react";
import { LikeButton } from "@/components/dashboard/like-button";

export interface PublicPrompt {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  authorName: string;
  likesCount: number;
  likedByMe: boolean;
}

interface PublicPromptCardProps {
  prompt: PublicPrompt;
  /** Авторизован ли пользователь (показываем кнопку лайка) */
  isAuthenticated: boolean;
}

export function PublicPromptCard({ prompt, isAuthenticated }: PublicPromptCardProps) {
  const dateStr = new Date(prompt.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Верхняя часть */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
            <MessageSquare className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-slate-800 leading-snug line-clamp-1">
            {prompt.title}
          </h3>
        </div>
        <p className="line-clamp-3 text-sm text-slate-500 leading-relaxed">
          {prompt.content}
        </p>
      </div>

      {/* Нижняя часть: автор, дата, лайки */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <UserIcon className="h-3 w-3" />
            {prompt.authorName}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {dateStr}
          </span>
        </div>

        {isAuthenticated ? (
          <LikeButton
            promptId={prompt.id}
            initialLiked={prompt.likedByMe}
            initialCount={prompt.likesCount}
          />
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            ❤ {prompt.likesCount}
          </span>
        )}
      </div>
    </div>
  );
}
