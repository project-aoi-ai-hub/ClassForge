"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  lessonId: string;
  initialIsCompleted: boolean;
}

export default function CompleteToggleButton({ lessonId, initialIsCompleted }: Props) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  const [isPending, startTransition] = useTransition();
  const [isRequesting, setIsRequesting] = useState(false);

  const disabled = isPending || isRequesting;

  async function toggle() {
    if (disabled) return;

    const next = !isCompleted;
    setIsCompleted(next); // 楽観的更新
    setIsRequesting(true);

    try {
      const res = await fetch("/api/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, isCompleted: next }),
      });

      if (!res.ok) throw new Error("更新失敗");

      // サイドバーの progressMap をサーバー再取得で同期
      startTransition(() => {
        router.refresh();
      });
    } catch {
      setIsCompleted(!next); // エラー時は元に戻す
    } finally {
      setIsRequesting(false);
    }
  }

  if (isCompleted) {
    return (
      <button
        onClick={toggle}
        disabled={disabled}
        className="shrink-0 flex items-center gap-1.5 text-sm font-medium text-success-600 border border-success-500 bg-success-50 px-3 py-1.5 rounded-lg hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        {disabled ? "更新中..." : "完了済み"}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={disabled}
      className="shrink-0 flex items-center gap-1.5 text-sm font-medium text-gray-500 border border-gray-200 bg-white px-3 py-1.5 rounded-lg hover:border-success-500 hover:text-success-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {disabled ? "更新中..." : "完了にする"}
    </button>
  );
}
