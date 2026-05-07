"use client";

// ===========================================
// 講座サムネイル画像アップロードコンポーネント
// ===========================================

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface Props {
  courseId: string;
  currentUrl: string | null;
}

export default function ThumbnailUpload({ courseId, currentUrl }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);

    // クライアント側バリデーション
    if (!file.type.startsWith("image/")) {
      setError("画像ファイルを選択してください（JPEG / PNG / WebP / GIF）");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("ファイルサイズは5MB以下にしてください");
      return;
    }

    // ローカルプレビューを即時表示
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/admin/courses/${courseId}/thumbnail`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "アップロードに失敗しました");
      }

      setPreview(data.thumbnailUrl);
      setSuccess(true);
      router.refresh(); // サーバー側のデータを再取得してリストに反映

      // 3秒後に成功メッセージを消す
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "アップロードに失敗しました";
      setError(msg);
      setPreview(currentUrl); // 失敗時はプレビューをロールバック
    } finally {
      setIsUploading(false);
      // input をリセットして同じファイルを再選択できるようにする
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">サムネイル画像</label>

      {/* プレビューエリア（クリックでファイル選択） */}
      <div className="relative w-full max-w-xs">
        <div
          className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-colors ${
            isUploading
              ? "border-primary-300 cursor-wait"
              : "border-dashed border-gray-200 cursor-pointer hover:border-primary-400"
          } bg-gray-50`}
          onClick={() => !isUploading && fileRef.current?.click()}
        >
          {preview ? (
            <img
              src={preview}
              alt="サムネイルプレビュー"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400 p-4">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="text-xs text-center leading-relaxed">
                クリックして<br />画像をアップロード
              </p>
            </div>
          )}

          {/* アップロード中オーバーレイ */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
              <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-white text-xs font-medium">アップロード中...</p>
            </div>
          )}
        </div>

        {/* ファイル入力（非表示） */}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {/* ヒント */}
      <p className="text-xs text-gray-400">
        JPEG / PNG / WebP / GIF・最大5MB・推奨 16:9
      </p>
      {preview && !isUploading && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-xs text-primary-600 hover:text-primary-700 transition-colors"
        >
          画像を変更する
        </button>
      )}

      {/* エラー / 成功メッセージ */}
      {error && (
        <p className="text-sm text-error-600 bg-error-50 px-3 py-2 rounded-lg">{error}</p>
      )}
      {success && (
        <p className="text-sm text-success-600 bg-success-50 px-3 py-2 rounded-lg">
          サムネイルを更新しました
        </p>
      )}
    </div>
  );
}
