// ===========================================
// 管理画面 売上管理（詳細フィルター対応）
// ===========================================

import type { Metadata } from "next";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import OrdersFilter from "./_components/OrdersFilter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "売上管理" };

type SearchParams = Promise<{
  from?: string;
  to?: string;
  courseId?: string;
}>;

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { from, to, courseId } = params;

  // 動的 where 句の構築
  const where: Prisma.PurchaseWhereInput = {};

  if (from || to) {
    where.createdAt = {};
    if (from) {
      where.createdAt.gte = new Date(`${from}T00:00:00`);
    }
    if (to) {
      where.createdAt.lte = new Date(`${to}T23:59:59`);
    }
  }
  if (courseId) {
    where.courseId = courseId;
  }

  const [purchases, courses] = await Promise.all([
    prisma.purchase.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  const totalRevenue = purchases
    .filter((p) => p.status === "PAID")
    .reduce((acc, p) => acc + p.amount, 0);

  const hasFilter = !!(from || to || courseId);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">売上管理</h1>
        <div className="bg-white rounded-xl border border-gray-100 px-6 py-3">
          <p className="text-xs text-gray-500">{hasFilter ? "絞り込み後の売上" : "総売上"}</p>
          <p className="text-xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
        </div>
      </div>

      {/* フィルター UI（useSearchParams を使うため Suspense でラップ） */}
      <Suspense fallback={<div className="h-24 bg-white rounded-xl border border-gray-100 mb-6 animate-pulse" />}>
        <OrdersFilter
          courses={courses}
          defaultFrom={from}
          defaultTo={to}
          defaultCourseId={courseId}
        />
      </Suspense>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-500">{purchases.length} 件</span>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">購入者</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">講座</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">金額</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">状態</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">購入日</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {purchases.map((purchase) => (
              <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{purchase.user.name || "未設定"}</p>
                  <p className="text-xs text-gray-500">{purchase.user.email}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{purchase.course.title}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatPrice(purchase.amount)}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    purchase.status === "PAID" ? "bg-success-50 text-success-600" : "bg-error-50 text-error-600"
                  }`}>
                    {purchase.status === "PAID" ? "支払済" : "返金済"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(purchase.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {purchases.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {hasFilter ? "条件に一致する売上がありません" : "まだ売上がありません"}
          </div>
        )}
      </div>
    </div>
  );
}
