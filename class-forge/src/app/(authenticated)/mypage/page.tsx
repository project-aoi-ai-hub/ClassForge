// ===========================================
// マイページ
// ===========================================

import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateProgress } from "@/lib/utils";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "マイページ",
};

export default async function MyPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // 購入済み講座を取得（進捗情報付き）
  const purchases = await prisma.purchase.findMany({
    where: { userId: session.user.id, status: "PAID" },
    include: {
      course: {
        include: {
          lessons: true,
          sections: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 各講座の進捗を取得
  const coursesWithProgress = await Promise.all(
    purchases.map(async (purchase) => {
      const completedLessons = await prisma.progress.count({
        where: {
          userId: session.user.id,
          lessonId: { in: purchase.course.lessons.map((l) => l.id) },
          isCompleted: true,
        },
      });

      // 最後に視聴したレッスンを取得
      const lastProgress = await prisma.progress.findFirst({
        where: {
          userId: session.user.id,
          lessonId: { in: purchase.course.lessons.map((l) => l.id) },
        },
        orderBy: { lastWatchedAt: "desc" },
        include: { lesson: true },
      });

      return {
        ...purchase,
        completedLessons,
        totalLessons: purchase.course.lessons.length,
        progress: calculateProgress(completedLessons, purchase.course.lessons.length),
        lastLesson: lastProgress?.lesson,
      };
    })
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* ヘッダー */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">マイページ</h1>
        <p className="mt-2 text-gray-500">
          ようこそ、{session.user.name}さん
        </p>
      </div>

      {/* 購入済み講座 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">受講中の講座</h2>

        {coursesWithProgress.length > 0 ? (
          <div className="space-y-4">
            {coursesWithProgress.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.completedLessons}/{item.totalLessons}レッスン完了
                    </p>

                    {/* プログレスバー */}
                    <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{item.progress}% 完了</p>
                  </div>

                  <div className="shrink-0">
                    <Link
                      href={
                        item.lastLesson
                          ? `/learn/${item.course.slug}/${item.lastLesson.slug}`
                          : `/learn/${item.course.slug}`
                      }
                    >
                      <Button variant="primary" size="sm">
                        {item.lastLesson ? "続きから再生" : "学習を始める"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <h3 className="text-lg font-medium text-gray-900">まだ受講中の講座はありません</h3>
            <p className="mt-2 text-gray-500 mb-6">講座を購入して学習を始めましょう</p>
            <Link href="/courses">
              <Button variant="primary">講座一覧を見る</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
