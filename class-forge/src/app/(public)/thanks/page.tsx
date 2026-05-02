// ===========================================
// 購入完了ページ
// ===========================================

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function ThanksPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          購入ありがとうございます！
        </h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          講座の購入が完了しました。
          <br />
          マイページから講座を受講できます。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/mypage">
            <Button variant="primary" size="lg">
              マイページへ
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline" size="lg">
              他の講座を見る
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
