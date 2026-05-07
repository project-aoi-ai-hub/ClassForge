// ===========================================
// レッスン視聴ページ
// ===========================================

import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import VideoPlayer from "@/components/player/VideoPlayer";
import LessonSidebar from "@/components/player/LessonSidebar";
import CompleteToggleButton from "@/components/player/CompleteToggleButton";

interface Props {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { courseSlug, lessonSlug } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
        include: { lessons: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  if (!course) notFound();

  // 現在のレッスンを取得
  const currentLesson = await prisma.lesson.findFirst({
    where: { courseId: course.id, slug: lessonSlug },
  });

  if (!currentLesson) notFound();

  // 購入確認（プレビューレッスンまたは無料講座は許可）
  if (course.price > 0 && !currentLesson.isPreview) {
    const purchase = await prisma.purchase.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    });
    if (!purchase) redirect(`/courses/${courseSlug}`);
  }

  // 進捗取得
  const progressList = await prisma.progress.findMany({
    where: { userId: session.user.id, lesson: { courseId: course.id } },
  });
  const progressMap = Object.fromEntries(
    progressList.map((p) => [p.lessonId, { isCompleted: p.isCompleted, watchedSeconds: p.watchedSeconds }])
  );

  // 現在のレッスンの進捗
  const currentProgress = await prisma.progress.findUnique({
    where: { userId_lessonId: { userId: session.user.id, lessonId: currentLesson.id } },
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      {/* メインコンテンツ */}
      <div className="flex-1 lg:max-w-[calc(100%-320px)]">
        {/* 動画プレイヤー */}
        <VideoPlayer
          lessonId={currentLesson.id}
          videoUrl={currentLesson.videoUrl}
          initialSeconds={currentProgress?.watchedSeconds || 0}
        />

        {/* レッスン情報 */}
        <div className="px-4 sm:px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{currentLesson.title}</h1>
            <CompleteToggleButton
              lessonId={currentLesson.id}
              initialIsCompleted={currentProgress?.isCompleted ?? false}
            />
          </div>
          {currentLesson.content && (
            <div className="mt-4 text-gray-600 leading-relaxed whitespace-pre-wrap">
              {currentLesson.content}
            </div>
          )}
        </div>
      </div>

      {/* サイドバー（レッスン一覧） */}
      <LessonSidebar
        course={course}
        currentLessonId={currentLesson.id}
        progressMap={progressMap}
      />
    </div>
  );
}
