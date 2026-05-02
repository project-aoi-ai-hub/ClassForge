// ===========================================
// 動画プレイヤーコンポーネント
// ===========================================

"use client";

import { useCallback, useEffect, useRef } from "react";

interface VideoPlayerProps {
  lessonId: string;
  videoUrl: string | null;
  initialSeconds: number;
}

export default function VideoPlayer({
  lessonId,
  videoUrl,
  initialSeconds,
}: VideoPlayerProps) {
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchedRef = useRef(initialSeconds);

  // 進捗を保存
  const saveProgress = useCallback(
    async (seconds: number, completed = false) => {
      try {
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId,
            watchedSeconds: Math.floor(seconds),
            isCompleted: completed,
          }),
        });
      } catch (error) {
        console.error("進捗保存エラー:", error);
      }
    },
    [lessonId]
  );

  // YouTube埋め込みURLを生成
  const getEmbedUrl = (url: string) => {
    // YouTube URL から動画IDを抽出
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (match) {
      const startParam = initialSeconds > 0 ? `&start=${initialSeconds}` : "";
      return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1${startParam}`;
    }
    return url;
  };

  // 定期的に進捗を保存（30秒ごと）
  useEffect(() => {
    progressTimer.current = setInterval(() => {
      watchedRef.current += 30;
      saveProgress(watchedRef.current);
    }, 30000);

    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
      // アンマウント時に最終進捗を保存
      saveProgress(watchedRef.current);
    };
  }, [saveProgress]);

  if (!videoUrl) {
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p>動画は準備中です</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-gray-900">
      <iframe
        src={getEmbedUrl(videoUrl)}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="動画プレイヤー"
      />
    </div>
  );
}
