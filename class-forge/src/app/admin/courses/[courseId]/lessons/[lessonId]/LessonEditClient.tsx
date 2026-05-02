"use client";

// ===========================================
// レッスン編集クライアントコンポーネント
// ===========================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { generateSlug } from "@/lib/utils";

interface Lesson {
  id: string;
  courseId: string;
  sectionId: string;
  title: string;
  slug: string;
  videoUrl: string | null;
  content: string | null;
  isPreview: boolean;
  duration: number | null;
  sortOrder: number;
}

interface Props {
  lesson: Lesson;
  courseId: string;
  courseSlug: string;
}

export default function LessonEditClient({ lesson, courseId, courseSlug }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(lesson.title);
  const [slug, setSlug] = useState(lesson.slug);
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl ?? "");
  const [content, setContent] = useState(lesson.content ?? "");
  const [isPreview, setIsPreview] = useState(lesson.isPreview);
  const [duration, setDuration] = useState(lesson.duration ? String(lesson.duration) : "");

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(lesson.title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/courses/${courseId}/lessons/${lesson.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          videoUrl: videoUrl || null,
          content: content || null,
          isPreview,
          duration: duration ? parseInt(duration, 10) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "保存に失敗しました" });
      } else {
        setMessage({ type: "success", text: "保存しました" });
      }
    } catch {
      setMessage({ type: "error", text: "通信エラーが発生しました" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`「${lesson.title}」を削除しますか？`)) return;

    const res = await fetch(`/api/admin/courses/${courseId}/lessons/${lesson.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push(`/admin/courses/${courseId}`);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
      {message && (
        <div className={`text-sm px-4 py-3 rounded-lg ${
          message.type === "success"
            ? "bg-success-50 text-success-600"
            : "bg-error-50 text-error-600"
        }`}>
          {message.text}
        </div>
      )}

      <Input
        label="レッスンタイトル *"
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        required
      />

      <Input
        label="スラッグ *"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        helperText={`視聴URL: /learn/${courseSlug}/${slug}`}
        required
      />

      <Input
        label="動画URL"
        type="url"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
        helperText="YouTube URL を入力してください（限定公開URLも使用可）"
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">テキスト補足（任意）</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          placeholder="レッスンの補足説明、参考リンク、要約などを記載..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-300 resize-none"
        />
      </div>

      <Input
        label="動画尺（秒）"
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="例: 480（8分）"
        min="0"
        helperText={duration ? `約${Math.floor(parseInt(duration) / 60)}分` : ""}
      />

      <div className="flex items-center gap-3 py-1">
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
            isPreview ? "bg-success-500" : "bg-gray-200"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
              isPreview ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <div>
          <p className="text-sm font-medium text-gray-700">無料プレビュー</p>
          <p className="text-xs text-gray-400">オンにすると未購入ユーザーも視聴できます</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="flex gap-3">
          <Button type="submit" variant="primary" isLoading={isSaving}>
            保存する
          </Button>
          <Link href={`/admin/courses/${courseId}`}>
            <Button type="button" variant="outline">
              カリキュラムへ戻る
            </Button>
          </Link>
        </div>
        <Button type="button" variant="danger" size="sm" onClick={handleDelete}>
          削除
        </Button>
      </div>
    </form>
  );
}
