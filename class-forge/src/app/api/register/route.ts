// ===========================================
// 会員登録 API
// ===========================================

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // バリデーション
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "すべての項目を入力してください" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "パスワードは8文字以上で入力してください" },
        { status: 400 }
      );
    }

    // 強度チェック: 英大文字、数字、記号の有無
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasNumber || !hasSymbol) {
      return NextResponse.json(
        { error: "パスワードには英大文字、数字、記号をそれぞれ1文字以上含める必要があります" },
        { status: 400 }
      );
    }

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています" },
        { status: 400 }
      );
    }

    // パスワードハッシュ化
    const passwordHash = await bcrypt.hash(password, 12);

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    return NextResponse.json(
      {
        message: "会員登録が完了しました",
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("会員登録エラー:", error);
    return NextResponse.json(
      { error: "会員登録に失敗しました。しばらくしてからお試しください" },
      { status: 500 }
    );
  }
}
