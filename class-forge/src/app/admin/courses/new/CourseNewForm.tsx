"use client";

// ===========================================
// 新規講座作成フォーム（クライアントコンポーネント）
// ===========================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { generateSlug } from "@/lib/utils";

export default function CourseNewForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");

  // タイトル変更時にスラッグを自動生成
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          description,
          price: parseInt(price, 10) || 0,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "講座の作成に失敗しました");
        return;
      }

      router.push(`/admin/courses/${data.course.id}`);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
      {error && (
        <div className="bg-error-50 text-error-600 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Input
        label="講座タイトル *"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="例：ChatGPT仕事術入門"
        required
      />

      <Input
        label="スラッグ（URL用） *"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="例：chatgpt-business"
        helperText="URLに使用される識別子。英数字・ハイフンのみ推奨。"
        required
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">説明文</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="講座の内容を説明してください..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-300 resize-none"
        />
      </div>

      <Input
        label="価格（円）"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        min="0"
        step="100"
        helperText="0 の場合は無料講座として公開されます。"
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">公開ステータス</label>
        <div className="flex gap-4">
          {(["DRAFT", "PUBLISHED"] as const).map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value={s}
                checked={status === s}
                onChange={() => setStatus(s)}
                className="text-primary-600"
              />
              <span className="text-sm text-gray-700">
                {s === "DRAFT" ? "下書き" : "公開"}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          講座を作成
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/courses")}
        >
          キャンセル
        </Button>
      </div>
    </form>
  );
}
