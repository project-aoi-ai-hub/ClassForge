"use server";

import { auth, unstable_update } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export type ActionResult = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function updateName(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です" };
  }

  const name = (formData.get("name") as string)?.trim();
  if (!name) {
    return { success: false, error: "名前を入力してください" };
  }

  // 現在の名前と同じ場合は、不必要な更新とセッションの不整合を避けるためスキップ
  if (name === session.user.name) {
    return { success: true, message: "変更はありません" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
  });

  // セッション（Cookie）を更新
  await unstable_update({
    user: {
      name: name,
    },
  });

  revalidatePath("/account");
  return { success: true, message: "名前を更新しました" };
}

export async function updatePassword(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "認証が必要です" };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: "すべての項目を入力してください" };
  }
  if (newPassword.length < 8) {
    return { success: false, error: "新しいパスワードは8文字以上で入力してください" };
  }
  
  // 強度チェック: 英大文字、数字、記号の有無
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  if (!hasUpperCase || !hasNumber || !hasSymbol) {
    return { 
      success: false, 
      error: "パスワードには英大文字、数字、記号をそれぞれ1文字以上含める必要があります" 
    };
  }
  if (newPassword !== confirmPassword) {
    return { success: false, error: "新しいパスワードが一致しません" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { passwordHash: true },
  });

  if (!user?.passwordHash) {
    return { success: false, error: "パスワードが設定されていません" };
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "現在のパスワードが正しくありません" };
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { passwordHash: newHash },
  });

  revalidatePath("/account");
  return { success: true, message: "パスワードを変更しました" };
}
