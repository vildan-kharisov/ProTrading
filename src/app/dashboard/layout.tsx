/**
 * Layout Личного кабинета.
 * Двухколоночная компоновка: сайдбар слева, контент справа.
 * Доступен только авторизованным пользователям.
 */
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userName = session.user.name ?? session.user.email ?? "Пользователь";
  const userImage = session.user.image ?? null;

  return (
    <div className="flex flex-1">
      <DashboardSidebar userName={userName} userImage={userImage} />
      <main className="flex-1 bg-white p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
