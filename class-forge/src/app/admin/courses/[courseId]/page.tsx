// ===========================================
// 管理画面: 講座編集
// ===========================================

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import CourseEditClient from "./CourseEditClient";

interface Props {
  params: Promise<{ courseId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params;
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  return { title: course ? `${course.title} 編集` : "講座編集" };
}

export const dynamic = "force-dynamic";

export default async function AdminCourseEditPage({ params }: Props) {
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
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

  return (
    <div>
      {/* パンくず */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/courses" className="hover:text-gray-700 transition-colors">講座管理</Link>
        <span>/</span>
        <span className="text-gray-900">{course.title}</span>
      </div>

      <CourseEditClient course={course} />
    </div>
  );
}
