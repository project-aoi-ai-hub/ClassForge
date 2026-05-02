// ===========================================
// 管理API: セクション 更新・削除
// PUT    /api/admin/courses/[courseId]/sections/[sectionId]
// DELETE /api/admin/courses/[courseId]/sections/[sectionId]
// ===========================================

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

interface Params {
  params: Promise<{ courseId: string; sectionId: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { sectionId } = await params;

  try {
    const { title, sortOrder } = await request.json();

    const section = await prisma.section.update({
      where: { id: sectionId },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      },
    });

    return NextResponse.json({ section });
  } catch (e) {
    console.error("セクション更新エラー:", e);
    return NextResponse.json({ error: "セクションの更新に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { sectionId } = await params;

  try {
    await prisma.section.delete({ where: { id: sectionId } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("セクション削除エラー:", e);
    return NextResponse.json({ error: "セクションの削除に失敗しました" }, { status: 500 });
  }
}
