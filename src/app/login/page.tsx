/**
 * Страница входа: OAuth Google.
 * Если пользователь уже авторизован — редирект в личный кабинет (/dashboard).
 */
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginButton } from "./login-button";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm dark:bg-zinc-950">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Вход в ProStore
        </h1>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Войдите через Google, чтобы получить доступ к личному кабинету и своим промтам.
        </p>
        <LoginButton />
      </div>
    </main>
  );
}
