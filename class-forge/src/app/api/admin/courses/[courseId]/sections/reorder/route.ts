// ===========================================
// 管理API: セクション 並び替え一括更新
// PUT /api/admin/courses/[courseId]/sections/reorder
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
    const body = await request.json() as {
      sections: { id: string; sortOrder: number }[];
    };

    if (!Array.isArray(body.sections) || body.sections.length === 0) {
      return NextResponse.json({ error: "sections は必須です" }, { status: 400 });
    }

    // $transaction で全セクションの sortOrder を一括更新
    await prisma.$transaction(
      body.sections.map(({ id, sortOrder }) =>
        prisma.section.update({
          where: { id, courseId },
          data: { sortOrder },
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("セクション並び替えエラー:", e);
    return NextResponse.json({ error: "並び替えの保存に失敗しました" }, { status: 500 });
  }
}
