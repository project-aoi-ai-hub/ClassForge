// ===========================================
// 汎用ユーティリティ
// ===========================================

/**
 * クラス名を結合するユーティリティ
 * Tailwind CSSのクラス結合に使用
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * 価格を日本円フォーマットで表示
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * 日付を日本語フォーマットで表示
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * 秒数を「〇分〇秒」形式に変換
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes === 0) return `${secs}秒`;
  if (secs === 0) return `${minutes}分`;
  return `${minutes}分${secs}秒`;
}

/**
 * スラッグ生成（日本語対応）
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * 進捗率の計算
 */
export function calculateProgress(
  completedCount: number,
  totalCount: number
): number {
  if (totalCount === 0) return 0;
  return Math.round((completedCount / totalCount) * 100);
}
