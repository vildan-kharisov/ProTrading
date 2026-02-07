/**
 * Карточка одного промта.
 * Показывает заголовок, превью контента и кнопки действий.
 */
"use client";

import { useState } from "react";
import {
  MessageSquare,
  Star,
  Pencil,
  Trash2,
  Globe,
  Lock,
} from "lucide-react";
import { togglePublic as _togglePublic, toggleFavorite as _toggleFavorite } from "@/lib/actions/prompt";

/** Обёртки для server actions — form action ожидает void */
async function toggleFavoriteAction(formData: FormData) {
  await _toggleFavorite(formData);
}
async function togglePublicAction(formData: FormData) {
  await _togglePublic(formData);
}
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { PromptDialog } from "./prompt-dialog";

export interface PromptData {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  isFavorite: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PromptCardProps {
  prompt: PromptData;
  currentUserId: string;
  /** Показывать ли кнопки владельца (edit, delete, toggle) */
  showOwnerActions?: boolean;
}

export function PromptCard({ prompt, currentUserId, showOwnerActions = true }: PromptCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const isOwner = prompt.userId === currentUserId;

  return (
    <>
      <div className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        {/* Иконка чата */}
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
          <MessageSquare className="h-4 w-4" />
        </div>

        {/* Заголовок и превью */}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-800 leading-snug">{prompt.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-500 leading-relaxed">
            {prompt.content}
          </p>
        </div>

        {/* Действия */}
        <div className="flex shrink-0 items-center gap-1">
          {/* Звезда (избранное) — только для владельца */}
          {isOwner && (
            <form action={toggleFavoriteAction}>
              <input type="hidden" name="id" value={prompt.id} />
              <button
                type="submit"
                className="rounded-md p-1.5 text-slate-400 hover:bg-yellow-50 hover:text-yellow-500 transition-colors"
                title={prompt.isFavorite ? "Убрать из избранного" : "В избранное"}
              >
                <Star
                  className={`h-4 w-4 ${prompt.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`}
                />
              </button>
            </form>
          )}

          {/* Кнопки владельца */}
          {isOwner && showOwnerActions && (
            <>
              {/* Public/Private toggle */}
              <form action={togglePublicAction}>
                <input type="hidden" name="id" value={prompt.id} />
                <button
                  type="submit"
                  className="rounded-md p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                  title={prompt.isPublic ? "Сделать приватным" : "Сделать публичным"}
                >
                  {prompt.isPublic ? (
                    <Globe className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </button>
              </form>

              {/* Редактировать */}
              <button
                onClick={() => setShowEditDialog(true)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 transition-colors"
                title="Редактировать"
              >
                <Pencil className="h-4 w-4" />
              </button>

              {/* Удалить */}
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Удалить"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Диалог удаления */}
      {showDeleteDialog && (
        <DeleteConfirmDialog
          promptId={prompt.id}
          promptTitle={prompt.title}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}

      {/* Диалог редактирования */}
      {showEditDialog && (
        <PromptDialog
          mode="edit"
          prompt={prompt}
          onClose={() => setShowEditDialog(false)}
        />
      )}
    </>
  );
}
