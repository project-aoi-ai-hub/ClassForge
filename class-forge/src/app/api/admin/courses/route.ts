// ===========================================
// 管理API: 講座 作成
// POST /api/admin/courses
// ===========================================

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { generateSlug } from "@/lib/utils";

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { title, description, price, status, slug: rawSlug } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "タイトルは必須です" }, { status: 400 });
    }

    const slug = rawSlug?.trim() || generateSlug(title) || `course-${Date.now()}`;

    const existing = await prisma.course.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "そのスラッグはすでに使用されています" }, { status: 409 });
    }

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        slug,
        description: description?.trim() || null,
        price: typeof price === "number" ? price : 0,
        status: status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (e) {
    console.error("講座作成エラー:", e);
    return NextResponse.json({ error: "講座の作成に失敗しました" }, { status: 500 });
  }
}
