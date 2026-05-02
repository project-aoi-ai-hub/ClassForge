// ===========================================
// 管理API: 講座 更新・削除
// PUT    /api/admin/courses/[courseId]
// DELETE /api/admin/courses/[courseId]
// ===========================================

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

interface Params {
  params: Promise<{ courseId: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { courseId } = await params;

  try {
    const { title, description, price, status, slug } = await request.json();

    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(slug !== undefined && { slug: slug.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(price !== undefined && { price: Number(price) }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json({ course });
  } catch (e) {
    console.error("講座更新エラー:", e);
    return NextResponse.json({ error: "講座の更新に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { courseId } = await params;

  try {
    await prisma.course.delete({ where: { id: courseId } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("講座削除エラー:", e);
    return NextResponse.json({ error: "講座の削除に失敗しました" }, { status: 500 });
  }
}
