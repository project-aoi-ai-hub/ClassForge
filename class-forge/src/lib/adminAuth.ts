// ===========================================
// 管理者権限チェックユーティリティ
// ===========================================

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return { session: null, error: NextResponse.json({ error: "認証が必要です" }, { status: 401 }) };
  }
  if ((session.user as { role?: string }).role !== "ADMIN") {
    return { session: null, error: NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 }) };
  }
  return { session, error: null };
}
