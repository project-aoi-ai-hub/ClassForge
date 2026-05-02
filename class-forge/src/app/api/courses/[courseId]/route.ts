// ===========================================
// 講座情報取得 API
// ===========================================

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, title: true, price: true, description: true, slug: true },
  });

  if (!course) {
    return NextResponse.json({ error: "講座が見つかりません" }, { status: 404 });
  }

  return NextResponse.json({ course });
}
