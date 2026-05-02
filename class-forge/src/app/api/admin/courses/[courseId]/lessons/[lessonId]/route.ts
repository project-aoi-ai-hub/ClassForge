// ===========================================
// 管理API: レッスン 更新・削除
// PUT    /api/admin/courses/[courseId]/lessons/[lessonId]
// DELETE /api/admin/courses/[courseId]/lessons/[lessonId]
// ===========================================

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

interface Params {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { lessonId } = await params;

  try {
    const { title, slug, videoUrl, content, isPreview, duration, sortOrder } = await request.json();

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(slug !== undefined && { slug: slug.trim() }),
        ...(videoUrl !== undefined && { videoUrl: videoUrl?.trim() || null }),
        ...(content !== undefined && { content: content?.trim() || null }),
        ...(isPreview !== undefined && { isPreview: Boolean(isPreview) }),
        ...(duration !== undefined && { duration: duration ? Number(duration) : null }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      },
    });

    return NextResponse.json({ lesson });
  } catch (e) {
    console.error("レッスン更新エラー:", e);
    return NextResponse.json({ error: "レッスンの更新に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { lessonId } = await params;

  try {
    await prisma.lesson.delete({ where: { id: lessonId } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("レッスン削除エラー:", e);
    return NextResponse.json({ error: "レッスンの削除に失敗しました" }, { status: 500 });
  }
}
