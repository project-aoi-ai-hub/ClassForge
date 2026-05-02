// ===========================================
// トップページ（LP）
// ===========================================

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div>
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50/30">
        {/* 背景装飾 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-40 blur-3xl" />
          <div className="absolute top-20 -left-20 w-60 h-60 bg-primary-200 rounded-full opacity-30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-3xl mx-auto">
            {/* バッジ */}
            <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary-700">
                新規講座追加中
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              AIスキルで
              <br />
              <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                キャリアを加速
              </span>
              させよう
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              ChatGPT、AI活用、業務自動化 ——
              <br className="hidden sm:block" />
              実践的なスキルが身につくオンライン講座プラットフォーム
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/courses">
                <Button variant="primary" size="lg">
                  講座を見る
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg">
                  無料で会員登録
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              なぜClassForgeが選ばれるのか
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              最短で実践力が身につく、3つの理由
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 特徴1 */}
            <div className="group relative bg-white rounded-2xl border border-gray-100 p-8 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-50 transition-all duration-300">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                動画で学べる
              </h3>
              <p className="text-gray-500 leading-relaxed">
                プロが解説する実践的な動画講座。スマホでいつでもどこでも学習を進められます。
              </p>
            </div>

            {/* 特徴2 */}
            <div className="group relative bg-white rounded-2xl border border-gray-100 p-8 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-50 transition-all duration-300">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                進捗を管理
              </h3>
              <p className="text-gray-500 leading-relaxed">
                視聴進捗を自動保存。前回の続きからすぐに再生でき、確実にスキルが身につきます。
              </p>
            </div>

            {/* 特徴3 */}
            <div className="group relative bg-white rounded-2xl border border-gray-100 p-8 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-50 transition-all duration-300">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                買い切り価格
              </h3>
              <p className="text-gray-500 leading-relaxed">
                一度購入すれば永久にアクセス可能。月額課金なし、追加費用なしで安心して学習できます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-400 rounded-full opacity-20 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            今すぐ学習を始めましょう
          </h2>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
            無料の会員登録で、講座の一部を無料で視聴できます。
            <br className="hidden sm:block" />
            あなたのスキルアップを今日から始めてみませんか？
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-700 hover:bg-primary-50 shadow-lg"
              >
                無料で会員登録する
              </Button>
            </Link>
            <Link href="/courses">
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10"
              >
                講座一覧を見る →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
