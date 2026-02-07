/**
 * Диалог подтверждения удаления промта.
 */
"use client";

import { useRef, useEffect } from "react";
import { deletePrompt } from "@/lib/actions/prompt";

interface DeleteConfirmDialogProps {
  promptId: string;
  promptTitle: string;
  onClose: () => void;
}

export function DeleteConfirmDialog({ promptId, promptTitle, onClose }: DeleteConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 z-50 m-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-0 shadow-xl backdrop:bg-black/40"
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold text-slate-800">Удалить промт?</h2>
        <p className="mt-2 text-sm text-slate-500">
          Промт <strong className="text-slate-700">&laquo;{promptTitle}&raquo;</strong> будет
          удалён навсегда. Это действие нельзя отменить.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Отмена
          </button>
          <form
            action={async (formData) => {
              await deletePrompt(formData);
              onClose();
            }}
          >
            <input type="hidden" name="id" value={promptId} />
            <button
              type="submit"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              Удалить
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
