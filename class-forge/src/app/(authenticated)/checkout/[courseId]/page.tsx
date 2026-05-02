// ===========================================
// 購入ページ
// ===========================================

"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

interface Props {
  params: Promise<{ courseId: string }>;
}

export default function CheckoutPage({ params }: Props) {
  const { courseId } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<{ title: string; price: number; description: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // 講座情報を取得
    fetch(`/api/courses/${courseId}`)
      .then((res) => res.json())
      .then((data) => setCourse(data.course))
      .catch(() => setError("講座情報の取得に失敗しました"));
  }, [courseId]);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "決済処理に失敗しました");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("決済処理に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">購入確認</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 p-6">
        <h2 className="text-lg font-bold text-gray-900">{course.title}</h2>
        {course.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-3">{course.description}</p>
        )}

        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600">合計</span>
            <span className="text-2xl font-bold text-gray-900">
              {course.price === 0 ? "無料" : formatPrice(course.price)}
            </span>
          </div>

          {error && (
            <div className="bg-error-50 text-error-600 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleCheckout}
            isLoading={isLoading}
          >
            {course.price === 0 ? "無料で受講を開始する" : "購入手続きへ進む"}
          </Button>

          <p className="text-xs text-gray-400 text-center mt-4">
            {course.price > 0 && "Stripeの安全な決済ページに移動します"}
          </p>
        </div>
      </div>
    </div>
  );
}
