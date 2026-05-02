// ===========================================
// 管理画面 会員管理
// ===========================================

import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import UserActions from "./_components/UserActions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "会員管理" };

export default async function AdminUsersPage() {
  const session = await auth();
  const currentUserId = session?.user?.id ?? "";

  const users = await prisma.user.findMany({
    include: { _count: { select: { purchases: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">会員管理</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} 件</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">名前</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">メール</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">権限</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">購入数</th>
              <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">登録日</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {user.name || "未設定"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    user.role === "ADMIN"
                      ? "bg-primary-50 text-primary-600"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {user.role === "ADMIN" ? "管理者" : "一般"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user._count.purchases}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                <td className="px-6 py-4">
                  <UserActions
                    userId={user.id}
                    role={user.role}
                    isSelf={user.id === currentUserId}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            ユーザーがまだいません
          </div>
        )}
      </div>
    </div>
  );
}
