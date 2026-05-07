// ===========================================
// 管理API: 講座サムネイルアップロード
// POST /api/admin/courses/[courseId]/thumbnail
// ===========================================

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminAuth";
import { createStorageClient, THUMBNAIL_BUCKET } from "@/lib/supabase";

interface Params {
  params: Promise<{ courseId: string }>;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { courseId } = await params;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "ファイルは必須です" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "画像ファイル（JPEG / PNG / WebP / GIF）のみアップロード可能です" },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "ファイルサイズは5MB以下にしてください" },
        { status: 400 }
      );
    }

    // 講座の存在確認
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "講座が見つかりません" }, { status: 404 });
    }

    // Supabase Storage へアップロード
    // 固定パス（upsert: true）で上書きすることでストレージを汚染しない
    const supabase = createStorageClient();
    const storagePath = `${courseId}/thumbnail`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(THUMBNAIL_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage アップロードエラー:", uploadError);
      throw uploadError;
    }

    // キャッシュバスターを付与して常に最新画像を取得
    const { data: { publicUrl } } = supabase.storage
      .from(THUMBNAIL_BUCKET)
      .getPublicUrl(storagePath);

    const thumbnailUrl = `${publicUrl}?t=${Date.now()}`;

    // DB 更新
    await prisma.course.update({
      where: { id: courseId },
      data: { thumbnailUrl },
    });

    return NextResponse.json({ thumbnailUrl });
  } catch (e) {
    const message = e instanceof Error ? e.message : "不明なエラー";
    console.error("サムネイルアップロードエラー:", message);

    // 環境変数未設定の場合の分かりやすいエラー
    if (message.includes("環境変数が未設定")) {
      return NextResponse.json(
        { error: "Supabase 環境変数が設定されていません。管理者に連絡してください。" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "アップロードに失敗しました" },
      { status: 500 }
    );
  }
}
