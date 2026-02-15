/**
 * Кнопка лайка с оптимистичным обновлением.
 * Отправляет POST /api/prompts/{id}/like и обновляет UI мгновенно.
 */
"use client";

import { useState, useCallback } from "react";
import { ThumbsUp } from "lucide-react";

interface LikeButtonProps {
  promptId: string;
  initialLiked: boolean;
  initialCount: number;
}

export function LikeButton({ promptId, initialLiked, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleToggle = useCallback(async () => {
    if (loading) return;

    // Оптимистичное обновление
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
    setLoading(true);

    try {
      const res = await fetch(`/api/prompts/${promptId}/like`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message = data?.error ?? "Ошибка";

        // Откатываем оптимистичное обновление
        setLiked(prevLiked);
        setCount(prevCount);

        if (res.status === 401) {
          alert("Необходимо войти в аккаунт, чтобы поставить лайк");
        } else {
          console.error("[LikeButton]", message);
        }
        return;
      }

      // Синхронизируем с реальными данными сервера
      const data: { liked: boolean; likesCount: number } = await res.json();
      setLiked(data.liked);
      setCount(data.likesCount);
    } catch {
      // Откатываем при сетевой ошибке
      setLiked(prevLiked);
      setCount(prevCount);
      console.error("[LikeButton] Сетевая ошибка");
    } finally {
      setLoading(false);
    }
  }, [promptId, liked, count, loading]);

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-60 ${
        liked
          ? "border-blue-200 bg-blue-50 text-blue-600"
          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      }`}
      title={liked ? "Убрать лайк" : "Нравится"}
    >
      <ThumbsUp
        className={`h-3.5 w-3.5 ${liked ? "fill-blue-500 text-blue-500" : ""}`}
      />
      <span>{count}</span>
    </button>
  );
}
