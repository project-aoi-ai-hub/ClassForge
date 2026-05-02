// ===========================================
// パスワードリセットリクエスト API
// ===========================================
// セキュリティ: メールの存在有無に関わらず常に200を返す

import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ ok: true });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // 既存トークンを削除してから新規作成
      await prisma.verificationToken.deleteMany({ where: { identifier: email } });

      const token = randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1時間後

      await prisma.verificationToken.create({
        data: { identifier: email, token, expires },
      });

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const resetUrl = `${appUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

      await sendPasswordResetEmail({ to: email, resetUrl });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("パスワードリセットリクエストエラー:", error);
    // セキュリティ上、エラーでも200を返す
    return NextResponse.json({ ok: true });
  }
}
