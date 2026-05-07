// ===========================================
// Supabase Storage クライアント（サーバーサイド専用）
// Service Role Key を使用するため必ずサーバーサイドでのみ呼び出すこと
// ===========================================

import { createClient } from "@supabase/supabase-js";

export function createStorageClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase 環境変数が未設定です。.env に SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください。"
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export const THUMBNAIL_BUCKET = "course-thumbnails";
