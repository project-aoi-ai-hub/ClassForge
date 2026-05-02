"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionResult = { success: boolean; error?: string };

async function requireAdmin(): Promise<{ id: string } | ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "認証が必要です" };
  if ((session.user as { role?: string }).role !== "ADMIN") {
    return { success: false, error: "権限がありません" };
  }
  return { id: session.user.id };
}

export async function toggleUserRole(userId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!("id" in admin)) return admin;

  if (admin.id === userId) {
    return { success: false, error: "自分自身の権限は変更できません" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user) return { success: false, error: "ユーザーが見つかりません" };

  await prisma.user.update({
    where: { id: userId },
    data: { role: user.role === "ADMIN" ? "USER" : "ADMIN" },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUser(userId: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!("id" in admin)) return admin;

  if (admin.id === userId) {
    return { success: false, error: "自分自身は削除できません" };
  }

  // 関連レコードを順番に削除してから本体を削除
  await prisma.$transaction([
    prisma.progress.deleteMany({ where: { userId } }),
    prisma.purchase.deleteMany({ where: { userId } }),
    prisma.session.deleteMany({ where: { userId } }),
    prisma.account.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  revalidatePath("/admin/users");
  return { success: true };
}
