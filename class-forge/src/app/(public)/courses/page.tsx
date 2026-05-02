// ===========================================
// 講座一覧ページ
// ===========================================

import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import CourseCard from "@/components/course/CourseCard";

// ビルド時にDB接続しない（リクエスト時に動的レンダリング）
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "講座一覧",
  description: "ClassForgeで学べるオンライン講座の一覧です。",
};

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    include: { sections: true, lessons: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">講座一覧</h1>
        <p className="mt-3 text-lg text-gray-500">あなたのスキルアップに最適な講座を見つけましょう</p>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              slug={course.slug}
              title={course.title}
              description={course.description}
              thumbnailUrl={course.thumbnailUrl}
              price={course.price}
              lessonsCount={course.lessons.length}
              sectionsCount={course.sections.length}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-lg font-medium text-gray-900">講座はまだありません</h3>
          <p className="mt-2 text-gray-500">新しい講座を準備中です。</p>
        </div>
      )}
    </div>
  );
}
