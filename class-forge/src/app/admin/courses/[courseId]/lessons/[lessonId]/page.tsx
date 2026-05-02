// ===========================================
// 管理画面: レッスン編集
// ===========================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import LessonEditClient from "./LessonEditClient";

interface Props {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  return { title: lesson ? `${lesson.title} 編集` : "レッスン編集" };
}

export const dynamic = "force-dynamic";

export default async function AdminLessonEditPage({ params }: Props) {
  const { courseId, lessonId } = await params;

  const [lesson, course] = await Promise.all([
    prisma.lesson.findFirst({
      where: { id: lessonId, courseId },
      include: { section: true },
    }),
    prisma.course.findUnique({ where: { id: courseId }, select: { id: true, title: true, slug: true } }),
  ]);

  if (!lesson || !course) notFound();

  return (
    <div className="max-w-2xl">
      {/* パンくず */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/admin/courses" className="hover:text-gray-700 transition-colors">講座管理</Link>
        <span>/</span>
        <Link href={`/admin/courses/${courseId}`} className="hover:text-gray-700 transition-colors">
          {course.title}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{lesson.title}</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">レッスン編集</h1>
        <p className="text-sm text-gray-500 mt-1">セクション: {lesson.section.title}</p>
      </div>

      <LessonEditClient lesson={lesson} courseId={courseId} courseSlug={course.slug} />
    </div>
  );
}
