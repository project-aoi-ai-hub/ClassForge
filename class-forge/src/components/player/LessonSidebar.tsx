// ===========================================
// レッスンサイドバーコンポーネント
// ===========================================

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LessonSidebarProps {
  course: {
    slug: string;
    title: string;
    sections: {
      id: string;
      title: string;
      lessons: {
        id: string;
        slug: string;
        title: string;
        isPreview: boolean;
      }[];
    }[];
  };
  currentLessonId: string;
  progressMap: Record<string, { isCompleted: boolean; watchedSeconds: number }>;
}

export default function LessonSidebar({
  course,
  currentLessonId,
  progressMap,
}: LessonSidebarProps) {
  return (
    <aside className="w-full lg:w-80 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-100 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-sm font-bold text-gray-900 mb-1">{course.title}</h2>
      </div>

      <div className="divide-y divide-gray-100">
        {course.sections.map((section, sIndex) => (
          <div key={section.id}>
            <div className="px-4 py-2.5 bg-gray-100/50">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                セクション {sIndex + 1}
              </p>
              <p className="text-sm font-medium text-gray-800 mt-0.5">
                {section.title}
              </p>
            </div>
            <div>
              {section.lessons.map((lesson, lIndex) => {
                const isCurrent = lesson.id === currentLessonId;
                const progress = progressMap[lesson.id];
                const isCompleted = progress?.isCompleted;

                return (
                  <Link
                    key={lesson.id}
                    href={`/learn/${course.slug}/${lesson.slug}`}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                      isCurrent
                        ? "bg-primary-50 text-primary-700 border-l-2 border-primary-600"
                        : "text-gray-600 hover:bg-gray-50 border-l-2 border-transparent"
                    )}
                  >
                    {/* 完了/番号アイコン */}
                    <span className="shrink-0">
                      {isCompleted ? (
                        <span className="w-5 h-5 bg-success-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      ) : (
                        <span className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium",
                          isCurrent ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-500"
                        )}>
                          {lIndex + 1}
                        </span>
                      )}
                    </span>

                    <span className="flex-1 line-clamp-2">{lesson.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
