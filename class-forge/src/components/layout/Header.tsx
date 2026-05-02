// ===========================================
// ヘッダーコンポーネント
// ===========================================

"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Button from "@/components/ui/Button";

export default function Header() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
              <span className="text-white font-bold text-sm">CF</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              Class<span className="text-primary-600">Forge</span>
            </span>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/courses"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              講座一覧
            </Link>
            {session ? (
              <>
                <Link
                  href="/mypage"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  マイページ
                </Link>
                <Link
                  href="/account"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  アカウント設定
                </Link>
                {(session.user as { role?: string }).role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    管理画面
                  </Link>
                )}
                <div className="ml-2 flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {session.user?.name}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    ログアウト
                  </Button>
                </div>
              </>
            ) : (
              <div className="ml-2 flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    ログイン
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    無料会員登録
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* モバイルメニューボタン */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="メニュー"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* モバイルメニュー */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-2 pt-4 space-y-2 animate-in slide-in-from-top-2">
            <Link
              href="/courses"
              className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              講座一覧
            </Link>
            {session ? (
              <>
                <Link
                  href="/mypage"
                  className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  マイページ
                </Link>
                <Link
                  href="/account"
                  className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  アカウント設定
                </Link>
                {(session.user as { role?: string }).role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    管理画面
                  </Link>
                )}
                <div className="px-4 pt-2">
                  <p className="text-sm text-gray-500 mb-2">{session.user?.name}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    ログアウト
                  </Button>
                </div>
              </>
            ) : (
              <div className="px-4 pt-2 space-y-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full">
                    ログイン
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    無料会員登録
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
