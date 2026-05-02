// ===========================================
// 講座詳細ページ
// ===========================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });
  if (!course) return { title: "講座が見つかりません" };
  return {
    title: course.title,
    description: course.description || `${course.title}の詳細ページ`,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  const course = await prisma.course.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
        include: {
          lessons: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });

  if (!course) notFound();

  // 購入済みかチェック
  let hasPurchased = false;
  if (session?.user?.id) {
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        },
      },
    });
    hasPurchased = !!purchase;
  }

  const totalLessons = course.sections.reduce(
    (acc, section) => acc + section.lessons.length,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* メインコンテンツ */}
        <div className="lg:col-span-2">
          {/* サムネイル */}
          <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl overflow-hidden mb-8">
            {course.thumbnailUrl ? (
              <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-20 h-20 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
            {course.title}
          </h1>

          {course.description && (
            <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-wrap">
              {course.description}
            </p>
          )}

          {/* カリキュラム */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">カリキュラム</h2>
            <div className="space-y-4">
              {course.sections.map((section, sIndex) => (
                <div key={section.id} className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-5 py-3">
                    <h3 className="font-semibold text-gray-900">
                      セクション{sIndex + 1}: {section.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {section.lessons.length}レッスン
                    </p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {section.lessons.map((lesson, lIndex) => (
                      <div key={lesson.id} className="flex items-center gap-3 px-5 py-3">
                        <span className="w-6 h-6 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium shrink-0">
                          {lIndex + 1}
                        </span>
                        <span className="text-sm text-gray-700 flex-1">{lesson.title}</span>
                        {lesson.isPreview && (
                          <span className="text-xs bg-success-50 text-success-600 px-2 py-0.5 rounded-full font-medium">
                            無料
                          </span>
                        )}
                        {!lesson.isPreview && !hasPurchased && (
                          <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* サイドバー（購入カード） */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 p-6">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-gray-900">
                {course.price === 0 ? "無料" : formatPrice(course.price)}
              </p>
              <p className="text-sm text-gray-500 mt-1">買い切り・永久アクセス</p>
            </div>

            <div className="space-y-3 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {course.sections.length}セクション
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {totalLessons}レッスン
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                永久アクセス
              </div>
            </div>

            {hasPurchased ? (
              <Link href={`/learn/${course.slug}`}>
                <Button variant="primary" size="lg" className="w-full">
                  講座を受講する
                </Button>
              </Link>
            ) : session ? (
              <Link href={`/checkout/${course.id}`}>
                <Button variant="primary" size="lg" className="w-full">
                  {course.price === 0 ? "無料で受講する" : "購入する"}
                </Button>
              </Link>
            ) : (
              <Link href="/register">
                <Button variant="primary" size="lg" className="w-full">
                  会員登録して購入する
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
