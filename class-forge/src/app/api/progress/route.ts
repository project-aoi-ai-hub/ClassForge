// ===========================================
// 視聴進捗 API
// ===========================================

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// 進捗保存
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { lessonId, watchedSeconds, isCompleted } = await request.json();

    if (!lessonId) {
      return NextResponse.json({ error: "レッスンIDは必須です" }, { status: 400 });
    }

    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: { userId: session.user.id, lessonId },
      },
      update: {
        watchedSeconds: watchedSeconds || 0,
        isCompleted: isCompleted || false,
        lastWatchedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        lessonId,
        watchedSeconds: watchedSeconds || 0,
        isCompleted: isCompleted || false,
      },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("進捗保存エラー:", error);
    return NextResponse.json({ error: "進捗の保存に失敗しました" }, { status: 500 });
  }
}

// 進捗取得
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    if (lessonId) {
      const progress = await prisma.progress.findUnique({
        where: { userId_lessonId: { userId: session.user.id, lessonId } },
      });
      return NextResponse.json({ progress });
    }

    // lessonIdなしの場合は全進捗を返す
    const progressList = await prisma.progress.findMany({
      where: { userId: session.user.id },
    });
    return NextResponse.json({ progress: progressList });
  } catch (error) {
    console.error("進捗取得エラー:", error);
    return NextResponse.json({ error: "進捗の取得に失敗しました" }, { status: 500 });
  }
}
