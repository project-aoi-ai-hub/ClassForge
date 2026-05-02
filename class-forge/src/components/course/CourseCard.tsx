// ===========================================
// 講座カードコンポーネント
// ===========================================

import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface CourseCardProps {
  slug: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  price: number;
  lessonsCount: number;
  sectionsCount: number;
}

export default function CourseCard({
  slug,
  title,
  description,
  thumbnailUrl,
  price,
  lessonsCount,
  sectionsCount,
}: CourseCardProps) {
  return (
    <Link
      href={`/courses/${slug}`}
      className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-primary-200 hover:shadow-xl hover:shadow-primary-50/50 transition-all duration-300"
    >
      {/* サムネイル */}
      <div className="relative aspect-video bg-gradient-to-br from-primary-100 to-primary-50 overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-primary-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {/* 価格バッジ */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-primary-700 text-sm font-bold px-3 py-1 rounded-full shadow-sm">
            {price === 0 ? "無料" : formatPrice(price)}
          </span>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
          {title}
        </h3>
        {description && (
          <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {sectionsCount}セクション
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {lessonsCount}レッスン
          </span>
        </div>
      </div>
    </Link>
  );
}
