// ===========================================
// 管理画面 ダッシュボード
// ===========================================

import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "管理画面" };

export default async function AdminDashboard() {
  const [usersCount, coursesCount, purchasesCount, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.purchase.count({ where: { status: "PAID" } }),
    prisma.purchase.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
  ]);

  const stats = [
    { label: "総会員数", value: usersCount, icon: "👤", href: "/admin/users" },
    { label: "講座数", value: coursesCount, icon: "📚", href: "/admin/courses" },
    { label: "購入数", value: purchasesCount, icon: "🛒", href: "/admin/orders" },
    { label: "総売上", value: formatPrice(totalRevenue._sum.amount || 0), icon: "💰", href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">ダッシュボード</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-100 p-6 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
