// ===========================================
// 講座視聴ページ（レッスン一覧）
// ===========================================

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface Props {
  params: Promise<{ courseSlug: string }>;
}

export default async function LearnCoursePage({ params }: Props) {
  const { courseSlug } = await params;
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

  // 購入確認（無料講座は購入不要）
  if (course.price > 0) {
    const purchase = await prisma.purchase.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    });
    if (!purchase) redirect(`/courses/${courseSlug}`);
  }

  // 最初のレッスンにリダイレクト
  const firstLesson = course.sections[0]?.lessons[0];
  if (firstLesson) {
    redirect(`/learn/${courseSlug}/${firstLesson.slug}`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p className="text-gray-500 mt-2">レッスンが見つかりません</p>
    </div>
  );
}
