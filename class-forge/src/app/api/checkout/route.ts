// ===========================================
// Stripe Checkout API
// ===========================================

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json({ error: "講座IDは必須です" }, { status: 400 });
    }

    // 講座存在チェック
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "講座が見つかりません" }, { status: 404 });
    }

    // 既に購入済みかチェック
    const existingPurchase = await prisma.purchase.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });

    if (existingPurchase) {
      return NextResponse.json({ error: "この講座は既に購入済みです" }, { status: 400 });
    }

    // 無料講座の場合は直接購入記録を作成
    if (course.price === 0) {
      await prisma.purchase.create({
        data: {
          userId: session.user.id,
          courseId,
          amount: 0,
          status: "PAID",
        },
      });
      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/thanks?free=true`,
      });
    }

    // Stripe Checkout セッション作成
    const checkoutSession = await createCheckoutSession({
      courseId,
      courseTitle: course.title,
      price: course.price,
      userId: session.user.id,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout エラー:", error);
    return NextResponse.json({ error: "決済処理に失敗しました" }, { status: 500 });
  }
}
