// ===========================================
// ログインページ
// ===========================================

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("メールアドレスまたはパスワードが正しくありません");
      } else {
        router.push("/mypage");
        router.refresh();
      }
    } catch {
      setError("ログインに失敗しました。しばらくしてからお試しください");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
            <span className="text-white font-bold text-lg">CF</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            ログイン
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            アカウントにログインして学習を続けましょう
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

            <Input
              label="パスワード"
              type="password"
              name="password"
              placeholder="8文字以上"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                パスワードを忘れた方
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              ログイン
            </Button>
          </form>
        </div>

        {/* 会員登録リンク */}
        <p className="mt-6 text-center text-sm text-gray-500">
          アカウントをお持ちでない方は{" "}
          <Link
            href="/register"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            無料会員登録
          </Link>
        </p>
      </div>
    </div>
  );
}
