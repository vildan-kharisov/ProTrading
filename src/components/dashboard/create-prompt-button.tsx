/**
 * Кнопка «+ Новый промт» — открывает диалог создания.
 */
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PromptDialog } from "./prompt-dialog";

export function CreatePromptButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Новый промт
      </button>
      {open && <PromptDialog mode="create" onClose={() => setOpen(false)} />}
    </>
  );
}
