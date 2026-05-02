// ===========================================
// 管理画面 講座管理
// ===========================================

import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "講座管理" };

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: { _count: { select: { lessons: true, purchases: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">講座管理</h1>
        <Link href="/admin/courses/new">
          <Button variant="primary" size="sm">＋ 新規講座</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">講座名</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">価格</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">状態</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">レッスン数</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">購入数</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">作成日</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{course.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatPrice(course.price)}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    course.status === "PUBLISHED"
                      ? "bg-success-50 text-success-600"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {course.status === "PUBLISHED" ? "公開中" : "下書き"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{course._count.lessons}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{course._count.purchases}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(course.createdAt)}</td>
                <td className="px-6 py-4">
                  <Link href={`/admin/courses/${course.id}`} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    編集
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {courses.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            講座がまだありません
          </div>
        )}
      </div>
    </div>
  );
}
