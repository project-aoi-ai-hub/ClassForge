// ===========================================
// 会員登録ページ
// ===========================================

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // バリデーション
    if (password !== confirmPassword) {
      setError("パスワードが一致しません");
      return;
    }

    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return;
    }

    setIsLoading(true);

    try {
      // 会員登録API呼び出し
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "会員登録に失敗しました");
        return;
      }

      // 登録成功後、自動ログイン
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // 登録は成功したがログインに失敗した場合
        router.push("/login");
      } else {
        router.push("/mypage");
        router.refresh();
      }
    } catch {
      setError("会員登録に失敗しました。しばらくしてからお試しください");
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
            無料会員登録
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            アカウントを作成して学習を始めましょう
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
              label="お名前"
              type="text"
              name="name"
              placeholder="山田 太郎"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />

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
              helperText="8文字以上で入力してください"
              autoComplete="new-password"
            />

            <Input
              label="パスワード（確認）"
              type="password"
              name="confirmPassword"
              placeholder="パスワードを再入力"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              無料で会員登録する
            </Button>

            <p className="text-xs text-gray-400 text-center leading-relaxed">
              会員登録をすることで、
              <Link
                href="/terms"
                className="text-primary-600 hover:underline"
              >
                利用規約
              </Link>
              および
              <Link
                href="/privacy"
                className="text-primary-600 hover:underline"
              >
                プライバシーポリシー
              </Link>
              に同意したものとみなされます。
            </p>
          </form>
        </div>

        {/* ログインリンク */}
        <p className="mt-6 text-center text-sm text-gray-500">
          既にアカウントをお持ちの方は{" "}
          <Link
            href="/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
