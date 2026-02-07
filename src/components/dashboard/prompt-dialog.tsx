/**
 * Диалог создания / редактирования промта.
 * Используется для Create и Update операций.
 */
"use client";

import { useRef, useEffect, useState } from "react";
import { createPrompt, updatePrompt } from "@/lib/actions/prompt";
import type { PromptData } from "./prompt-card";

interface PromptDialogProps {
  mode: "create" | "edit";
  prompt?: PromptData;
  onClose: () => void;
}

export function PromptDialog({ mode, prompt, onClose }: PromptDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    const action = mode === "create" ? createPrompt : updatePrompt;
    const result = await action(formData);

    if (result.success) {
      onClose();
    } else {
      setError(result.error ?? "Произошла ошибка");
      setLoading(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 z-50 m-auto w-full max-w-lg rounded-xl border border-slate-200 bg-white p-0 shadow-xl backdrop:bg-black/40"
    >
      <form action={handleSubmit} className="p-6">
        <h2 className="text-lg font-semibold text-slate-800">
          {mode === "create" ? "Новый промт" : "Редактировать промт"}
        </h2>

        {/* Скрытый ID при редактировании */}
        {mode === "edit" && prompt && (
          <input type="hidden" name="id" value={prompt.id} />
        )}

        {/* Заголовок */}
        <div className="mt-4">
          <label htmlFor="prompt-title" className="mb-1.5 block text-sm font-medium text-slate-700">
            Заголовок
          </label>
          <input
            id="prompt-title"
            name="title"
            type="text"
            required
            maxLength={200}
            defaultValue={prompt?.title ?? ""}
            placeholder="Введите заголовок промта..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-colors"
          />
        </div>

        {/* Содержимое */}
        <div className="mt-4">
          <label htmlFor="prompt-content" className="mb-1.5 block text-sm font-medium text-slate-700">
            Содержимое
          </label>
          <textarea
            id="prompt-content"
            name="content"
            required
            maxLength={10000}
            rows={6}
            defaultValue={prompt?.content ?? ""}
            placeholder="Введите текст промта..."
            className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-colors"
          />
        </div>

        {/* Переключатель публичности */}
        <div className="mt-4 flex items-center gap-2">
          <input
            id="prompt-public"
            name="isPublic"
            type="checkbox"
            value="true"
            defaultChecked={prompt?.isPublic ?? false}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-200"
          />
          <label htmlFor="prompt-public" className="text-sm text-slate-600">
            Сделать публичным
          </label>
        </div>

        {/* Ошибка */}
        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        {/* Кнопки */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading
              ? "Сохранение..."
              : mode === "create"
                ? "Создать"
                : "Сохранить"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
