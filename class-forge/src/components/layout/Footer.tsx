// ===========================================
// フッターコンポーネント
// ===========================================

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ブランド */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CF</span>
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                Class<span className="text-primary-600">Forge</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              AIを活用したスキルを学べる
              <br />
              オンライン講座プラットフォーム
            </p>
          </div>

          {/* 講座 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">講座</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/courses"
                  className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                >
                  講座一覧
                </Link>
              </li>
            </ul>
          </div>

          {/* サポート */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              サポート
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                >
                  よくある質問
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                >
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>

          {/* 法的事項 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              法的事項
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                >
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                >
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                >
                  特定商取引法に基づく表記
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 text-center">
            © {currentYear} ClassForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
