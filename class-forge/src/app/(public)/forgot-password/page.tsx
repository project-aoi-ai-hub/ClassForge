// ===========================================
// パスワード再発行ページ
// ===========================================

"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        // セキュリティ上、メールが存在しない場合でも成功表示
        setIsSubmitted(true);
      }
    } catch {
      setError("送信に失敗しました。しばらくしてからお試しください");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-success-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            メールを送信しました
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            入力されたメールアドレスにパスワードリセットの
            <br />
            案内をお送りしました。メールをご確認ください。
          </p>
          <Link href="/login">
            <Button variant="outline">ログインページへ戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            パスワードの再設定
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            登録済みのメールアドレスを入力してください
          </p>
        </div>

        {/* フォーム */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-error-50 border border-error-500/20 text-error-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <Input
              label="メールアドレス"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              リセットメールを送信する
            </Button>
          </form>
        </div>

        {/* ログインリンク */}
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link
            href="/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← ログインに戻る
          </Link>
        </p>
      </div>
    </div>
  );
}
