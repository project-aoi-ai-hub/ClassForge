// ===========================================
// 管理画面レイアウト
// ===========================================

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AuthProvider from "@/components/providers/AuthProvider";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") redirect("/mypage");

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {/* 管理画面ヘッダー */}
        <header className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-6">
                <Link href="/admin" className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-xs">CF</span>
                  </div>
                  <span className="font-bold text-sm">管理画面</span>
                </Link>
                <nav className="hidden sm:flex items-center gap-1">
                  <Link href="/admin/courses" className="px-3 py-1.5 text-sm text-gray-300 hover:text-white rounded-md hover:bg-gray-800 transition-colors">
                    講座管理
                  </Link>
                  <Link href="/admin/users" className="px-3 py-1.5 text-sm text-gray-300 hover:text-white rounded-md hover:bg-gray-800 transition-colors">
                    会員管理
                  </Link>
                  <Link href="/admin/orders" className="px-3 py-1.5 text-sm text-gray-300 hover:text-white rounded-md hover:bg-gray-800 transition-colors">
                    売上管理
                  </Link>
                </nav>
              </div>
              <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                サイトに戻る →
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
