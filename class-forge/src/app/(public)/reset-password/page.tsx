// ===========================================
// パスワード再設定ページ
// ===========================================

"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "パスワードの再設定に失敗しました");
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("通信エラーが発生しました。しばらくしてからお試しください");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="text-center space-y-4">
        <p className="text-error-600 font-medium">リンクが無効です。</p>
        <Link
          href="/forgot-password"
          className="inline-block text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          もう一度パスワードリセットをリクエストする →
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-5">
        <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">パスワードを変更しました</h2>
          <p className="text-sm text-gray-500 mt-1">
            新しいパスワードでログインしてください。
          </p>
        </div>
        <Link href="/login">
          <Button variant="primary" className="w-full">
            ログインページへ
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-error-50 border border-error-500/20 text-error-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <Input
        label="新しいパスワード"
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
        パスワードを変更する
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            パスワードの再設定
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            新しいパスワードを入力してください
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8">
          <Suspense fallback={<p className="text-center text-gray-500 text-sm">読み込み中...</p>}>
            <ResetPasswordContent />
          </Suspense>
        </div>

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
