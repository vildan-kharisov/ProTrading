"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-950">
        <h2 className="mb-4 text-xl font-semibold text-red-600 dark:text-red-400">
          Произошла ошибка
        </h2>
        <p className="mb-4 text-zinc-600 dark:text-zinc-400">
          {error.message || "Неизвестная ошибка"}
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Попробовать снова
        </button>
      </div>
    </main>
  );
}
