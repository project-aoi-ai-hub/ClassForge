// ===========================================
// 管理API: レッスン 作成
// POST /api/admin/courses/[courseId]/sections/[sectionId]/lessons
// ===========================================

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { generateSlug } from "@/lib/utils";

interface Params {
  params: Promise<{ courseId: string; sectionId: string }>;
}

export async function POST(request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { courseId, sectionId } = await params;

  try {
    const { title, videoUrl, content, isPreview, duration, slug: rawSlug } = await request.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: "レッスン名は必須です" }, { status: 400 });
    }

    // slug を生成（courseId スコープで一意にする）
    let slug = rawSlug?.trim() || generateSlug(title);
    if (!slug) slug = `lesson-${Date.now()}`;

    // 同一 courseId 内でスラッグ重複確認・リトライ
    const existing = await prisma.lesson.findUnique({ where: { courseId_slug: { courseId, slug } } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    // 現在の最大 sortOrder を取得
    const lastLesson = await prisma.lesson.findFirst({
      where: { sectionId },
      orderBy: { sortOrder: "desc" },
    });
    const sortOrder = (lastLesson?.sortOrder ?? -1) + 1;

    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        sectionId,
        title: title.trim(),
        slug,
        videoUrl: videoUrl?.trim() || null,
        content: content?.trim() || null,
        isPreview: isPreview === true,
        duration: duration ? Number(duration) : null,
        sortOrder,
      },
    });

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (e) {
    console.error("レッスン作成エラー:", e);
    return NextResponse.json({ error: "レッスンの作成に失敗しました" }, { status: 500 });
  }
}
