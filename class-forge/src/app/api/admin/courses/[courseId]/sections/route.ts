// ===========================================
// 管理API: セクション 作成
// POST /api/admin/courses/[courseId]/sections
// ===========================================

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";

interface Params {
  params: Promise<{ courseId: string }>;
}

export async function POST(request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { courseId } = await params;

  try {
    const { title } = await request.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: "セクション名は必須です" }, { status: 400 });
    }

    // 現在の最大 sortOrder を取得
    const lastSection = await prisma.section.findFirst({
      where: { courseId },
      orderBy: { sortOrder: "desc" },
    });
    const sortOrder = (lastSection?.sortOrder ?? -1) + 1;

    const section = await prisma.section.create({
      data: { courseId, title: title.trim(), sortOrder },
    });

    return NextResponse.json({ section }, { status: 201 });
  } catch (e) {
    console.error("セクション作成エラー:", e);
    return NextResponse.json({ error: "セクションの作成に失敗しました" }, { status: 500 });
  }
}
