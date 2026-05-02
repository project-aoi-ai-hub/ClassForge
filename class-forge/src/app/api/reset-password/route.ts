// ===========================================
// パスワード再設定 API
// ===========================================

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, token, password } = await request.json();

    if (!email || !token || !password) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "パスワードは8文字以上で入力してください" },
        { status: 400 }
      );
    }

    // トークン検証
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier: email, token } },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json(
        { error: "リンクが無効または期限切れです。再度パスワードリセットをリクエストしてください" },
        { status: 400 }
      );
    }

    // パスワード更新
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    // 使用済みトークンを削除
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token } },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("パスワード再設定エラー:", error);
    return NextResponse.json({ error: "パスワードの再設定に失敗しました" }, { status: 500 });
  }
}
